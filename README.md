## Password Utility Functions

<span id="BADGE_GENERATION_MARKER_0"></span>
[![Custom](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest) [![codecov](https://codecov.io/gh/TheRealSyler/suf-password/branch/master/graph/badge.svg)](https://codecov.io/gh/TheRealSyler/suf-password) [![circleci](https://img.shields.io/circleci/build/github/TheRealSyler/suf-password)](https://app.circleci.com/github/TheRealSyler/suf-password/pipelines) [![npmV](https://img.shields.io/npm/v/suf-password?color=green)](https://www.npmjs.com/package/suf-password) [![min](https://img.shields.io/bundlephobia/min/suf-password)](https://bundlephobia.com/result?p=suf-password) [![install](https://badgen.net/packagephobia/install/suf-password)](https://packagephobia.now.sh/result?p=suf-password) [![githubLastCommit](https://img.shields.io/github/last-commit/TheRealSyler/suf-password)](https://github.com/TheRealSyler/suf-password)
<span id="BADGE_GENERATION_MARKER_1"></span>

## Usage

```typescript
const checks: Password.ValidateCheck[] = [
  {
    type: 'customRegex',
    customRegex: /123/g,
    invertCheck: true,
    customError: 'cannot contain 123'
  },
  { type: 'uppercase' },
  { type: 'numbers' },
  {
    type: 'custom',
    custom: password => password !== '123456',
    customError: 'password cannot be 123456'
  }
];
Password.Validate('123456', checks); // doesn't pass
Password.Validate('Abcd', checks); // doesn't pass
Password.Validate('Abcd321', checks); // passes

const password = 'theBestPassword123$';
Password.ValidateSimple(password); // should meet all the requirements and return true.
```

<span id="DOC_GENERATION_MARKER_0"></span>

# Docs

- **[index](#index)**

  - [Password](#password)

### index

##### Password

```typescript
namespace Password {
    /** Defines the properties of a Password.Validate Check  */
    interface PasswordCheck {
        /** Type of the check  */
        type: 'custom' | 'numbers' | 'letters' | 'lowercase' | 'uppercase' | 'spaces' | 'symbols' | 'customRegex';
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
    interface ValidateOptions {
        /** the maximum length of the password. */
        maxLength?: number;
        /** the minimum length of the password. */
        minLength?: number;
        /** if true additional data will be returned. */
        passData?: boolean;
    }
    interface ValidateReturn {
        /** array that contains the error messages of all the failed checks. */
        errors: string[];
        /** true if all the checks have passed successfully. */
        passed: boolean;
        /** array with the additional data about each test. */
        validationData?: {
            invertCheck: boolean;
            errType: string;
        }[];
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
    function Validate(password: string, checks: PasswordCheck[], options?: ValidateOptions): ValidateReturn;
    /**
     * The password has to contain an uppercase letter, number and cannot contain any spaces.
     * @param password password or string to check.
     */
    function ValidateSimple(password: string): boolean;
}
```

_Generated with_ **[suf-cli](https://www.npmjs.com/package/suf-cli)**
<span id="DOC_GENERATION_MARKER_1"></span>

<span id="LICENSE_GENERATION_MARKER_0"></span>
Copyright (c) 2020 Leonard Grosoli Licensed under the MIT license.
<span id="LICENSE_GENERATION_MARKER_1"></span>
