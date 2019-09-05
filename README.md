## Password Utility Functions

```typescript

'Validates a password or other strings with checks that have to be provided in the checks array,'
'if the passed key of the returned object is true'
'then all checks have been passed successfully.'
Password.Validate(password: string, checks: ValidateCheck[], options: ValidateOptions);
@example
const checks: Password.ValidateCheck[] = [
  { type: 'customRegex', customRegex: /123/g, negative: true, customError: 'cannot contain 123' },
  { type: 'uppercase' },
  { type: 'numbers' },
  { type: 'custom', customFunc: password => password !== '123456', customError: 'password cannot be 123456' }
];
Password.Validate('123456', checks)// doesn't pass
Password.Validate('Abcd', checks) // doesn't pass
Password.Validate('Abcd321', checks) // passes


'The password has to contain a uppercase letter, a number, a symbol, and cannot contain any spaces.'
Password.ValidateSimple(password: string);
@example
const password = 'theBestPassword123$'
Password.ValidateSimple(password); // should meet all the requirements and return true.

const a = MathUtils.Clamp(200, 0, 100);//= a = 100
```