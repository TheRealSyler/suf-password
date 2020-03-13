import { Password } from '..';

test('ValidateSimple', () => {
  expect(Password.ValidateSimple('test')).toBe(false);

  expect(Password.ValidateSimple('Test1234')).toBe(true);
});

test('Validate', () => {
  const checks: Password.ValidateCheck[] = [
    {
      type: 'customRegex',
      customRegex: /123/g,
      invertCheck: true,
      customError: 'cannot contain 123'
    },
    { type: 'uppercase' },
    { type: 'numbers' },
    { type: 'letters' },
    { type: 'symbols', times: 2, invertCheck: true },
    { type: 'symbols' },
    { type: 'lowercase', times: 2 },
    {
      type: 'custom',
      customFunc: password => password !== '123456',
      customError: 'password cannot be 123456'
    }
  ];
  expect(Password.Validate('123456', checks)).toStrictEqual({
    errors: [
      'cannot contain 123',
      'password has to contain at least one uppercase letter',
      'password has to contain at least one letter',
      'password has to contain at least one symbol',
      'password has to contain 2 or more lowercase letters',
      'password cannot be 123456'
    ],
    passed: false
  });

  expect(Password.Validate('AbcdTest321%', checks)).toStrictEqual({
    errors: [],
    passed: true
  });

  expect(Password.Validate('Test1234', [], { maxLength: 2 })).toStrictEqual({
    passed: false,
    errors: ['Password is to long']
  });
  expect(Password.Validate('passData1$', checks, { passData: true })).toStrictEqual({
    passed: true,
    errors: [],
    validationData: [
      {
        errType: 'customRegex',
        invertCheck: true
      },
      {
        errType: 'normal',
        invertCheck: undefined
      },
      {
        errType: 'normal',
        invertCheck: undefined
      },
      {
        errType: 'normal',
        invertCheck: undefined
      },
      {
        errType: 'times',
        invertCheck: true
      },
      {
        errType: 'normal',
        invertCheck: undefined
      },
      {
        errType: 'times',
        invertCheck: undefined
      },
      {
        errType: 'custom',
        invertCheck: undefined
      }
    ]
  });
});
