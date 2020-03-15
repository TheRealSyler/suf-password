export namespace Password {
  /** Defines the properties of a Password.Validate Check  */
  export interface PasswordCheck {
    /** Type of the check  */
    type:
      | 'custom'
      | 'numbers'
      | 'letters'
      | 'lowercase'
      | 'uppercase'
      | 'spaces'
      | 'symbols'
      | 'customRegex';
    /**
     * if the type is one of  **`'numbers' | 'letters' | 'lowercase' | 'uppercase' | 'spaces' | 'symbols'`** then this
     * property defines the times that the type can occur without failing the check, if invertCheck is true then
     * this property defines how many time this type is allowed.
     */
    times?: number;

    /**
     * if true then the result of **`'numbers' | 'letters' | 'lowercase' | 'uppercase' | 'spaces' | 'symbols' | 'customRegex'`**
     * will be inverted, example if the type is  **`customRegex`** and customRegex =  **`/123/g`** then the password cannot contain  **`123`**.
     */
    invertCheck?: boolean;

    /** if the type is **`custom`** then this function will be executed.  */
    custom?: (password: string) => boolean;

    /** if the type is **`customRegex`** then this regex will be tested.  */
    customRegex?: RegExp;

    /** if the type is **`custom | customRegex`** then this will be the error the if the check fail's.   */
    customError?: string;
  }

  /** Options for the Password.Validate function. */
  export interface ValidateOptions {
    /** the maximum length of the password. */
    maxLength?: number;

    /** the minimum length of the password. */
    minLength?: number;

    /** if true additional data will be returned. */
    passData?: boolean;
  }
  export interface ValidateReturn {
    /** array that contains the error messages of all the failed checks. */
    errors: string[];

    /** true if all the checks have passed successfully. */
    passed: boolean;

    /** array with the additional data about each test. */
    validationData?: { invertCheck: boolean; errType: string }[];
  }

  /**
   * Validates a password or other strings with checks that have to be provided in the checks array,
   * if the **`passed`** key of the returned object is true
   * then all checks have been passed successfully.
   *
   * @param password password or other string to be checked.
   * @param checks array of checks that will be performed.
   * @param options min and max length and other stuff.
   */
  export function Validate(
    password: string,
    checks: PasswordCheck[],
    options: ValidateOptions = { maxLength: 100, minLength: 0, passData: false }
  ): ValidateReturn {
    const errors: string[] = [];
    const data = [];
    let passed = true;
    if (password.length > options.maxLength || password.length < options.minLength) {
      const isLong = password.length > options.maxLength;
      errors.push(
        `password is to ${isLong ? 'long' : 'short'}, has to be ${
          isLong ? 'less than' : 'at least'
        } ${isLong ? options.maxLength : options.minLength} characters long.`
      );
      passed = false;
    }
    for (let i = 0; i < checks.length; i++) {
      const check = validateCheck.call({}, checks[i], password);
      data.push(check.data);
      if (check.err) {
        errors.push(check.err);
      }
      if (check.passed === false) {
        passed = false;
      }
    }
    if (options.passData) {
      return { passed, errors, validationData: data };
    } else {
      return { passed, errors };
    }
  }

  /**
   * The password has to contain an uppercase letter, number and cannot contain any spaces.
   * @param password password or string to check.
   */
  export function ValidateSimple(password: string): boolean {
    return Password.Validate(password, [
      { type: 'uppercase' },
      { type: 'numbers' },
      { type: 'spaces', invertCheck: true }
    ]).passed;
  }
  interface CheckRegexReturn {
    errType: 'normal' | 'times';
    passed: boolean;
  }

  type CheckData = {
    invertCheck: boolean;
    errType: string;
  };

  interface ValidateCheckContext {
    error?: string;
    passed: boolean;
    regexMatch: CheckRegexReturn;
    data: CheckData;
    password: string;
    check: PasswordCheck;
  }

  interface ValidateCheckReturn {
    err: string;
    passed: boolean;
    data: CheckData;
  }

  function validateCheck(
    this: ValidateCheckContext,
    Check: PasswordCheck,
    Password: string
  ): ValidateCheckReturn {
    this.check = Check;
    this.password = Password;
    this.error = undefined;
    this.passed = true;
    this.data = {
      invertCheck: this.check.invertCheck,
      errType: undefined
    };

    switch (this.check.type) {
      case 'custom':
        WrapCustomFuncOrCustomRegex.call(this, 'custom');
        break;
      case 'customRegex':
        WrapCustomFuncOrCustomRegex.call(this, 'customRegex');
        break;
      case 'numbers':
        WrapValidateCheckCase.call(this, /\d/g, ['number']);

        break;
      case 'letters':
        WrapValidateCheckCase.call(this, /[a-z][A-Z]/g, ['letter']);
        break;
      case 'lowercase':
        WrapValidateCheckCase.call(this, /[a-z]/g, ['lowercase letter']);

        break;
      case 'uppercase':
        WrapValidateCheckCase.call(this, /[A-Z]/g, ['uppercase letter']);

        break;
      case 'spaces':
        WrapValidateCheckCase.call(this, /\s/g, ['space']);

        break;
      case 'symbols':
        WrapValidateCheckCase.call(
          this,
          /[`~\!@#\$%\^\&\*\(\)\-_\=\+\[\{\}\]\\\|;:'",<.>\/\?€£¥₹]/g,
          'symbol'
        );
        break;
      default:
        this.error = 'checking type not valid.';
        break;
    }
    return { err: this.error, passed: this.passed, data: this.data };
  }

  function WrapCustomFuncOrCustomRegex(this: ValidateCheckContext, type: 'customRegex' | 'custom') {
    if (this.check[type]) {
      this.passed =
        type === 'custom'
          ? this.check.custom(this.password)
          : this.check.customRegex.test(this.password);
      if (this.check.invertCheck) {
        this.passed = !this.passed;
      }
      this.error = this.passed ? undefined : this.check.customError;
    } else {
      this.error = `${type} has to be defined.`;
    }
    this.data.errType = type;
  }

  function WrapValidateCheckCase(this: ValidateCheckContext, regex: RegExp, type: string) {
    this.regexMatch = checkRegexMatch(
      this.password.match(regex),
      this.check.invertCheck,
      this.check.times
    );

    this.data.errType = this.regexMatch.errType;
    this.passed = this.regexMatch.passed;
    if (this.check.customError && this.passed !== true) {
      this.error = this.check.customError;
    } else if (!this.passed) {
      this.error = validateHandleErr.call(this, type);
    }
  }

  function validateHandleErr(this: ValidateCheckContext, type: string): string | undefined {
    if (!this.regexMatch.passed) {
      if (this.regexMatch.errType === 'normal') {
        return this.check.invertCheck
          ? `password cannot contain ${type}s.`
          : `password has to contain at least one ${type}.`;
      } else {
        return this.check.invertCheck
          ? `password cannot contain more than ${this.check.times} ${type}s.`
          : `password has to contain ${this.check.times} or more ${type}s.`;
      }
    }
    return undefined;
  }

  function checkRegexMatch(match: RegExpMatchArray, invertCheck: boolean, times: number): any {
    if (match === null) {
      return { errType: times ? 'times' : 'normal', passed: invertCheck ? true : false };
    }
    if (times) {
      return {
        errType: 'times',
        passed: invertCheck ? match.length <= times : match.length >= times
      };
    }
    return { errType: 'normal', passed: invertCheck ? match.length < 1 : match.length > 0 };
  }
}
