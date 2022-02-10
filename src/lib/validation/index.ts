import { InvalidPropertyException } from '@srclaunch/exceptions';
// import { ValidationException } from '@srclaunch/exceptions';
import { Condition, ValidationProblem } from '@srclaunch/types';
import emailValidator from 'email-validator';
import passwordValidator from 'password-validator';


export function validate(
  value: unknown,
  props: {
    [key in Condition]?: boolean | string | number;
  },
): ValidationProblem[] {
  // const logger = new Logger();
  // const getLengthArg = (value: number | boolean | string[]) => {
  //   return typeof value === 'boolean' && value === true
  //     ? undefined
  //     : Number(value);
  // };

  const problems: undefined | ValidationProblem[] = Object.entries(props)
    .filter(prop => {
      if (!prop) return false;

      const ruleName = prop[0];

      if (!Object.values(Condition).includes(ruleName as Condition)) {
        throw new InvalidPropertyException(
          `Configuration property "${prop[0]}" is not supported.`,
          {},
        );
      }

      return true;
    })
    .map(([conditionName, conditionValue]) => {
      const createValidationProblem = (
        condition: Condition,
        context?: { subject?: string; requirement?: string | number | boolean },
      ) => {
        return {
          condition,
          message: getValidationProblemLabel(condition, context),
          value,
        };
      };

      switch (conditionName) {
        case Condition.IsRequired:
          if (typeof conditionValue !== 'boolean') {
            throw new TypeError(
              `Configuration property "IsRequired" must be a boolean.`,
            );
          }

          if (conditionValue === true && (!value || value === '')) {
            return createValidationProblem(conditionName);
          }

          break;
        case Condition.HasLetterCount:
          {
            if (
              (Number.isNaN(conditionValue) ||
                !Number.isInteger(conditionValue)) &&
              typeof conditionValue !== 'boolean'
            ) {
              throw new TypeError(
                `Configuration property "HasLetterCount" must be a number or boolean`,
              );
            }

            const schema = new passwordValidator();

            if (conditionValue === 0 || conditionValue === false) {
              schema.has().not().letters();
            } else {
              schema.has().letters(conditionValue);
            }

            if (!value || typeof value !== 'string' || !schema.validate(value))
              return createValidationProblem(conditionName, {
                requirement: conditionValue,
              });
          }
          break;
        case Condition.HasLowercaseCount:
          {
            if (
              (Number.isNaN(conditionValue) ||
                !Number.isInteger(conditionValue)) &&
              typeof conditionValue !== 'boolean'
            ) {
              throw new TypeError(
                `Configuration property "HasLowercaseCount" must be a number or boolean`,
              );
            }

            const schema = new passwordValidator();

            if (conditionValue === 0) {
              schema.has().not().lowercase();
            } else {
              schema.has().lowercase(conditionValue);
            }

            if (!value || typeof value !== 'string' || !schema.validate(value))
              return createValidationProblem(conditionName, {
                requirement: conditionValue,
              });
          }
          break;
        case Condition.HasNumberCount:
          {
            if (
              (Number.isNaN(conditionValue) ||
                !Number.isInteger(conditionValue)) &&
              typeof conditionValue !== 'boolean'
            ) {
              throw new TypeError(
                `Configuration property "HasNumberCount" must be a number or boolean`,
              );
            }

            const schema = new passwordValidator();

            if (conditionValue === 0) {
              schema.has().not().digits();
            } else {
              schema.has().digits(conditionValue);
            }

            if (!value || typeof value !== 'string' || !schema.validate(value))
              return createValidationProblem(conditionName, {
                requirement: conditionValue,
              });
          }
          break;
        case Condition.HasSymbolCount:
          {
            if (
              (Number.isNaN(conditionValue) ||
                !Number.isInteger(conditionValue)) &&
              typeof conditionValue !== 'boolean'
            ) {
              throw new TypeError(
                `Configuration property "HasSymbolCount" must be a number or boolean`,
              );
            }

            const schema = new passwordValidator();

            if (conditionValue === 0) {
              schema.has().not().symbols();
            } else {
              schema.has().symbols(conditionValue);
            }

            if (!value || typeof value !== 'string' || !schema.validate(value))
              return createValidationProblem(conditionName, {
                requirement: conditionValue,
              });
          }
          break;
        case Condition.HasUppercaseCount:
          {
            if (
              (Number.isNaN(conditionValue) ||
                !Number.isInteger(conditionValue)) &&
              typeof conditionValue !== 'boolean'
            ) {
              throw new TypeError(
                `Configuration property "HasUppercaseCount" must be a number or boolean`,
              );
            }

            const schema = new passwordValidator();

            if (conditionValue === 0) {
              schema.has().not().uppercase();
            } else {
              schema.has().uppercase(conditionValue);
            }

            if (!value || typeof value !== 'string' || !schema.validate(value))
              return createValidationProblem(conditionName, {
                requirement: conditionValue,
              });
          }
          break;
        case Condition.IsEmailAddress:
          if (typeof conditionValue !== 'boolean') {
            throw new TypeError(
              `Configuration property "IsEmailAddress" must be a boolean.`,
            );
          }

          if (typeof value !== 'string') {
            return createValidationProblem(conditionName);
          }

          if (!emailValidator.validate(value)) {
            return createValidationProblem(conditionName);
          }

          break;
        case Condition.IsEqual:
          if (value !== conditionValue) {
            return createValidationProblem(conditionName);
          }

          break;
        case Condition.IsNotNull:
          if (typeof conditionValue !== 'boolean') {
            throw new TypeError(
              `Configuration property "IsNotNull" must be a boolean.`,
            );
          }

          if (value === null) {
            return createValidationProblem(conditionName);
          }

          break;
        case Condition.IsLengthEqual:
          if (
            Number.isNaN(conditionValue) ||
            !Number.isInteger(conditionValue)
          ) {
            throw new TypeError(
              `Configuration property "IsLengthEqual" must be a number.`,
            );
          }

          if (typeof value !== 'string' || value.length !== conditionValue) {
            return createValidationProblem(conditionName, {
              requirement: conditionValue,
            });
          }

          break;
        case Condition.IsLengthGreaterThanOrEqual:
          if (
            !conditionValue ||
            Number.isNaN(conditionValue) ||
            !Number.isInteger(conditionValue)
          ) {
            throw new TypeError(
              `Configuration property "IsLengthGreaterThanOrEqual" must be a number.`,
            );
          }

          if (typeof value !== 'string' || value.length < conditionValue) {
            return createValidationProblem(conditionName, {
              requirement: conditionValue,
            });
          }

          break;
        case Condition.IsLengthLessThanOrEqual:
          if (
            !conditionValue ||
            Number.isNaN(conditionValue) ||
            !Number.isInteger(conditionValue)
          ) {
            throw new TypeError(
              `Configuration property "IsLengthLessThanOrEqual" must be a number.`,
            );
          }

          if (typeof value !== 'string' || value.length > conditionValue) {
            return createValidationProblem(conditionName, {
              requirement: conditionValue,
            });
          }

          break;
      }

      return undefined;
    })
    .filter(prop => {
      if (!prop) return false;

      return true;
    }) as ValidationProblem[];

  // .map(prop => {
  //   return {
  //     rule: (prop[0].charAt(0).toUpperCase() +
  //       prop[0].slice(1)) as ValidationRule,
  //     value: prop[1],
  //   };
  // })
  //   .map(({ rule, value }) => {
  //     switch (rule) {
  //       case ValidationRule.Required:
  //         if (str === undefined || str === null) return ValidationRule.Required;

  //         break;
  //       case ValidationRule.AllowList:
  //         if (!Array.isArray(value)) {
  //           throw new TypeError(
  //             `Configuration property "allowList" must be an array of strings.`,
  //           );
  //         }

  //         if (!str || typeof str !== 'string' || !value.includes(str)) {
  //           return ValidationRule.AllowList;
  //         }

  //         break;
  //       case ValidationRule.BlockList:
  //         if (!Array.isArray(value)) {
  //           throw new TypeError(
  //             `Configuration property "blockList" must be an array of strings.`,
  //           );
  //         }

  //         if (!str || typeof str !== 'string' || value.includes(str)) {
  //           return ValidationRule.BlockList;
  //         }

  //         break;
  //       case ValidationRule.EmailAddress:
  //         if (!str || typeof str !== 'string' || !isEmail.validate(str)) {
  //           return ValidationRule.EmailAddress;
  //         }

  //         break;
  //
  //       case ValidationRule.MaxLength:
  //         {
  //           const length = Number(value);

  //           if (Number.isNaN(length) || !Number.isInteger(length)) {
  //             throw new TypeError(
  //               `Configuration property "maxLength" must be a number`,
  //             );
  //           }

  //           const schema = new validator();

  //           schema.is().max(length);

  //           if (str && typeof str === 'string' && !schema.validate(str))
  //             return ValidationRule.MaxLength;
  //         }
  //         break;
  //       case ValidationRule.MinLength:
  //         {
  //           const length = Number(value);

  //           if (Number.isNaN(length) || !Number.isInteger(length)) {
  //             throw new TypeError(
  //               `Configuration property "minLength" must be a number`,
  //             );
  //           }

  //           const schema = new validator();

  //           schema.is().min(length);

  //           if (!str || typeof str !== 'string' || !schema.validate(str))
  //             return ValidationRule.MinLength;
  //         }
  //         break;
  //       case ValidationRule.Number:
  //         if (!Number.isNaN(str) || !Number.isInteger(str))
  //           return ValidationRule.Number;

  //         break;
  //
  //       case ValidationRule.PhoneNumber:
  //         if (!Number.isNaN(str) || !Number.isInteger(str))
  //           return ValidationRule.PhoneNumber;

  //         break;

  //       case ValidationRule.String:
  //         if (typeof str === 'string') return ValidationRule.String;

  //         break;
  //       case ValidationRule.Spaces:
  //         {
  //           if (
  //             (Number.isNaN(value) || !Number.isInteger(value)) &&
  //             typeof value !== 'boolean'
  //           ) {
  //             throw new TypeError(
  //               `Configuration property "spaces" must be a number or boolean`,
  //             );
  //           }

  //           const length = getLengthArg(value);
  //           const schema = new validator();

  //           if (length === 0) {
  //             schema.has().not().spaces();
  //           } else {
  //             schema.has().spaces(length);
  //           }

  //           if (!str || typeof str !== 'string' || !schema.validate(str))
  //             return ValidationRule.Spaces;
  //         }
  //         break;
  //
  //     }

  //     return undefined;
  //   })
  //   .filter(prop => {
  //     if (!prop) return false;

  //     return true;
  //   }) as ValidationProblem[];

  return problems || [];
}

export function getValidationProblemLabel(
  condition: Condition,
  context?: {
    subject?: string;
    requirement?: string | number | boolean;
  },
): {
  short: string;
  long: string;
} {
  switch (condition) {
    case Condition.Contains:
      return {
        long: 'Missing a required pattern.',
        short: 'Missing string pattern',
      };
    case Condition.HasCharacterCount:
      return {
        long: 'Does not meet character length requirement.',
        short: 'Not enough characters',
      };
    case Condition.HasNumberCount:
      return {
        long: 'Does not meet number count requirement.',
        short: 'Not enough numbers',
      };
    case Condition.HasLetterCount:
      return {
        long: 'Does not contain required number of characters.',
        short: 'Not enough letters',
      };
    case Condition.HasLowercaseCount:
      return {
        long: 'Does not contain enough lowercase letters.',
        short: 'Not enough lowercase letters',
      };
    case Condition.HasSpacesCount:
      return {
        long: 'Does not contain enough spaces.',
        short: 'Not enough spaces',
      };
    case Condition.HasSymbolCount:
      return {
        long: 'Does not meet symbol count requirement.',
        short: 'Not enough symbols',
      };
    case Condition.HasUppercaseCount:
      return {
        long: 'Does not contain enough uppercase letters.',
        short: 'Not enough uppercase letters',
      };
    case Condition.IsAfter:
      return {
        long: `Value is not after ${context?.requirement}`,
        short: `Is not after ${context?.requirement}`,
      };
    case Condition.IsAfterOrEqual:
      return {
        long: `Value is not after or equal to ${context?.requirement}`,
        short: `Is not equal or after ${context?.requirement}`,
      };
    case Condition.IsAirport:
      return {
        long: 'Value is not a valid airport identifier code.',
        short: 'Invalid airport code',
      };
    case Condition.IsAlpha:
      return {
        long: 'Value does not consist of only letters.',
        short: 'Only letters allowed',
      };
    case Condition.IsAlphanumeric:
      return {
        long: 'Provided value is not alphanumeric.',
        short: 'Only letters and numbers allowed',
      };
    case Condition.IsAlgorithmHash:
      return {
        long: 'Value does not match algorithm hash.',
        short: 'Invalid algorithm hash',
      };
    case Condition.IsAscii:
      return {
        long: 'Value is not valid ASCII string.',
        short: 'Not valid ASCII',
      };
    case Condition.IsBase64:
      return {
        long: 'Value is not valid Base64 string.',
        short: 'Not valid Base64',
      };
    case Condition.IsBefore:
      return {
        long: `Value is not before ${context?.requirement}.`,
        short: `Not before ${context?.requirement}`,
      };
    case Condition.IsBeforeOrAfter:
      return {
        long: `Value is not before or after ${context?.requirement}.`,
        short: `Not before or after to ${context?.requirement}`,
      };
    case Condition.IsBeforeOrEqual:
      return {
        long: `Value is not before or equal to${context?.requirement}.`,
        short: `Not before or equal to ${context?.requirement}`,
      };
    case Condition.IsBetween:
      return {
        long: `Value is not between ${context?.requirement}.`,
        short: `Value is not between ${context?.requirement}`,
      };
    case Condition.IsBIC:
      return { long: 'Not a valid BIC number.', short: 'Invalid BIC ID' };
    case Condition.IsBitcoinAddress:
      return {
        long: 'Not a valid Bitcoin address.',
        short: 'Invalid Bitcoin address',
      };
    case Condition.IsBoolean:
      return {
        long: 'Not a valid boolean value.',
        short: 'Must be boolean value',
      };
    case Condition.IsColor:
      return { long: 'Not a valid color value.', short: 'Invalid color' };
    case Condition.IsComplexEnough:
      return {
        long: 'Does not meet complexity requirements.',
        short: 'Not complex enough',
      };
    case Condition.IsCountry:
      return {
        long: 'Not a valid country code.',
        short: 'Invalid country code',
      };
    case Condition.IsCreditCard:
      return {
        long: 'Not a valid credit card number.',
        short: 'Invalid credit card number',
      };
    case Condition.IsCurrency:
      return {
        long: 'Not a valid currency code.',
        short: 'Invalid currency code',
      };
    case Condition.IsDataURI:
      return { long: 'Not a valid data URI.', short: 'Invalid data URI' };
    case Condition.IsDate:
      return { long: 'Not a valid date.', short: 'Invalid date' };
    case Condition.IsDateRange:
      return { long: 'Not a valid date range.', short: 'Invalid date range' };
    case Condition.IsDateTime:
      return {
        long: 'Not a valid DateTime value.',
        short: 'Invalid DateTime value',
      };
    case Condition.IsDayOfMonth:
      return {
        long: 'Not a day of the month.',
        short: 'Not valid day of month',
      };
    case Condition.IsDecimal:
      return {
        long: 'Not a valid decimal value.',
        short: 'Invalid decimal value',
      };
    case Condition.IsDivisibleBy:
      return {
        long: `Not divisible by ${context?.requirement}.`,
        short: `Not divisible by ${context?.requirement}`,
      };
    case Condition.IsDomainName:
      return { long: 'Not a valid domain name.', short: 'Invalid domain name' };
    case Condition.IsEmailAddress:
      return {
        long: 'Not a valid email address.',
        short: 'Invalid email address',
      };
    case Condition.IsEthereumAddress:
      return {
        long: 'Not a valid Ethereum address.',
        short: 'Invalid Ethereum address',
      };
    case Condition.IsEAN:
      return { long: 'Not a valid EAN number.', short: 'Invalid EAN number' };
    case Condition.IsEIN:
      return { long: 'Not a valid EIN number.', short: 'Invalid EIN number' };
    case Condition.IsEqual:
      return {
        long: `Value is not equal to ${context?.requirement}.`,
        short: `Not equal to ${context?.requirement}`,
      };
    case Condition.IsEvenNumber:
      return {
        long: 'Value is not an even number.',
        short: 'Not an even number',
      };
    case Condition.IsFloat:
      return {
        long: 'Value is not a floating point integer.',
        short: 'Invalid float value',
      };
    case Condition.IsIBAN:
      return { long: 'Not a valid IBAN number.', short: 'Invalid IBAN number' };
    case Condition.IsGreaterThan:
      return {
        long: `Value is not greater than ${context?.requirement}.`,
        short: `Not greater than ${context?.requirement}`,
      };
    case Condition.IsGreaterThanOrEqual:
      return {
        long: `Value is not greater than or equal to ${context?.requirement}`,
        short: `Not greater or equal to ${context?.requirement}`,
      };
    case Condition.IsHSLColor:
      return {
        long: 'Value is not valid HSL color string.',
        short: 'Invalid HSL value',
      };
    case Condition.IsHexColor:
      return {
        long: 'Not a valid hexadecimal color code string.',
        short: 'Invalid hex color code',
      };
    case Condition.IsHexadecimal:
      return {
        long: 'Not a valid hexadecimal string.',
        short: 'Not hexadecimal value',
      };
    case Condition.IsIdentityCardCode:
      return {
        long: 'Not a valid identity card code.',
        short: 'Invalid ID card',
      };
    case Condition.IsIMEI:
      return { long: 'Not a valid IMEI number.', short: 'Invalid IMEI number' };
    case Condition.IsInIPAddressRange:
      return {
        long: `Value is not within ${context?.requirement} IP range`,
        short: 'Not in IP range',
      };
    case Condition.IsInList:
      return {
        long: 'Value is not included in given list.',
        short: 'Not in list',
      };
    case Condition.IsInTheLast:
      return {
        long: 'Value is not the last item in given list.',
        short: 'Not last in list',
      };
    case Condition.IsInteger:
      return {
        long: 'Value is not a valid integer value.',
        short: 'Not an integer',
      };
    case Condition.IsIPAddress:
      return {
        long: 'Value is not a valid IP address.',
        short: 'Invalid IP address',
      };
    case Condition.IsIPAddressRange:
      return {
        long: 'Not a valid IP address range.',
        short: 'Invalid IP address range',
      };
    case Condition.IsISBN:
      return {
        long: 'Value is not valid ISBN number.',
        short: 'Invalid ISBN number',
      };
    case Condition.IsISIN:
      return {
        long: 'Value is not a valid ISIN number.',
        short: 'Invalid ISIN number',
      };
    case Condition.IsISMN:
      return {
        long: 'Value is not a valid ISMN number.',
        short: 'Invalid ISMN number',
      };
    case Condition.IsISRC:
      return {
        long: 'Value is not a valid ISRC number.',
        short: 'Invalid ISRC number',
      };
    case Condition.IsISSN:
      return {
        long: 'Value is not a valid ISSN number.',
        short: 'Invalid ISSN number',
      };
    case Condition.IsISO4217:
      return {
        long: 'Value is not ISO-4217 compliant currency code.',
        short: 'Invalid currency code',
      };
    case Condition.IsISO8601:
      return {
        long: 'Value is not ISO-8601 compliant date string.',
        short: 'Invalid date',
      };
    case Condition.IsISO31661Alpha2:
      return {
        long: 'Not a valid ISO-3166-1 Alpha 2 country code.',
        short: 'Invalid country code',
      };
    case Condition.IsISO31661Alpha3:
      return {
        long: 'Not a valid ISO-3166-1 Alpha 3 country code.',
        short: 'Invalid country code',
      };
    case Condition.IsJSON:
      return { long: 'Not valid JSON data.', short: 'Invalid JSON' };
    case Condition.IsLanguage:
      return {
        long: 'Value is not a valid language code.',
        short: 'Invalid language code',
      };
    case Condition.IsLatitude:
      return {
        long: 'Not a valid latitudinal coordinate.',
        short: 'Invalid latitude coordinate',
      };
    case Condition.IsLongitude:
      return {
        long: 'Not a valid longitudinal coordinate.',
        short: 'Invalid longitude coordinate',
      };
    case Condition.IsLengthEqual:
      return {
        long: `Length of value is not equal to ${context?.requirement}.`,
        short: `Length not equal to ${context?.requirement}`,
      };
    case Condition.IsLengthGreaterThan:
      return {
        long: `Length of value is not greater than ${context?.requirement}.`,
        short: `Not long enough`,
      };
    case Condition.IsLengthGreaterThanOrEqual:
      return {
        long: `Length of value is not greater than or equal to ${context?.requirement}.`,
        short: `Not long enough`,
      };
    case Condition.IsLengthLessThan:
      return {
        long: `Length of value is not less than ${context?.requirement}.`,
        short: `Too long`,
      };
    case Condition.IsLengthLessThanOrEqual:
      return {
        long: `Length of value is not less than or equal to ${context?.requirement}.`,
        short: `Too long`,
      };
    case Condition.IsLessThan:
      return {
        long: `Value is not less than ${context?.requirement}.`,
        short: `Not less than ${context?.requirement}`,
      };
    case Condition.IsLessThanOrEqual:
      return {
        long: `Value is not less than or equal to ${context?.requirement}.`,
        short: `Not less or equal to ${context?.requirement}`,
      };
    case Condition.IsLicensePlateNumber:
      return {
        long: 'Not a valid license plate number.',
        short: 'Invalid license plate number',
      };
    case Condition.IsLowercase:
      return {
        long: 'Value is not all lowercase.',
        short: 'Not all lowercase',
      };
    case Condition.IsOctal:
      return {
        long: 'Value is not a valid octal string.',
        short: 'Invalid octal value',
      };
    case Condition.IsMACAddress:
      return {
        long: 'Value is not a valid MAC address.',
        short: 'Invalid MAC address',
      };
    case Condition.IsMD5:
      return {
        long: 'Value is not valid MD5 hash string.',
        short: 'Invalid MD5 string',
      };
    case Condition.IsMagnetURI:
      return {
        long: 'Not a valid Magnet URI string.',
        short: 'Invalid Magnet URI',
      };
    case Condition.IsMarkdown:
      return {
        long: 'Value is not a valid markdown string.',
        short: 'Invalid Markdown',
      };
    case Condition.IsMimeType:
      return {
        long: 'Value is not a valid HTTP MIME type.',
        short: 'Invalid MIME type',
      };
    case Condition.IsMonth:
      return { long: 'Value is not a valid month.', short: 'Invalid month' };
    case Condition.IsNegativeNumber:
      return {
        long: 'Value is not a negative number.',
        short: 'Number not negative',
      };
    case Condition.IsNotDate:
      return {
        long: 'Value is not a valid date string.',
        short: 'Invalid date',
      };
    case Condition.IsNotEqual:
      return {
        long: `Value is equal to ${context?.requirement}.`,
        short: `Can't be equal to ${context?.requirement}`,
      };
    case Condition.IsNotInIPAddressRange:
      return {
        long: 'Value is not within IP range.',
        short: 'Not in IP address range',
      };
    case Condition.IsNotInList:
      return { long: 'Value is not allowed.', short: 'Not allowed' };
    case Condition.IsNotNull:
      return {
        long: 'Value is required and must not be null.',
        short: 'Cannot be null',
      };
    case Condition.IsNotRegexMatch:
      return {
        long: 'Value does not match required pattern.',
        short: 'Invalid pattern',
      };
    case Condition.IsNotToday:
      return {
        long: 'Value must not be same date as current day.',
        short: 'Cannot be today',
      };
    case Condition.IsNumber:
      return { long: 'Value is not a number.', short: 'Not a number' };
    case Condition.IsNumeric:
      return {
        long: 'String value must be numeric only.',
        short: 'Not numeric',
      };
    case Condition.IsOddNumber:
      return {
        long: 'Value must be an odd number.',
        short: 'Not an odd number',
      };
    case Condition.IsPassportNumber:
      return {
        long: 'Not a valid password number.',
        short: 'Invalid password number',
      };
    case Condition.IsPhoneNumber:
      return {
        long: 'Not a valid phone number.',
        short: 'Invalid phone number',
      };
    case Condition.IsPort:
      return { long: 'Not a valid port number.', short: 'Invalid port number' };
    case Condition.IsPositiveNumber:
      return { long: 'Not a positive number.', short: 'Not a positive number' };
    case Condition.IsPostalCode:
      return { long: 'Not a valid postal code.', short: 'Invalid postal code' };
    case Condition.IsProvince:
      return {
        long: 'Not a valid province code.',
        short: 'Invalid province code',
      };
    case Condition.IsRGBColor:
      return {
        long: 'Not a valid RGB color string.',
        short: 'Invalid RGB color',
      };
    case Condition.IsRegexMatch:
      return {
        long: 'Value does not match required pattern.',
        short: 'Missing string pattern',
      };
    case Condition.IsRequired:
      return {
        long: 'Field is required.',
        short: 'Required field',
      };
    case Condition.IsSemanticVersion:
      return {
        long: 'Value is not a valid semantic version.',
        short: 'Invalid version',
      };
    case Condition.IsSlug:
      return {
        long: 'Not a valid URL slug string.',
        short: 'Invalid URL slug',
      };
    case Condition.IsSSN:
      return {
        long: 'Not a valid social security number.',
        short: 'Invalid SSN',
      };
    case Condition.IsState:
      return { long: 'Not a valid state code.', short: 'Invalid state code' };
    case Condition.IsStreetAddress:
      return {
        long: 'Not a valid street address.',
        short: 'Invalid street address',
      };
    case Condition.IsString:
      return {
        long: 'Value is not a valid string.',
        short: 'Must be a string',
      };
    case Condition.IsStrongPassword:
      return {
        long: 'A stronger password is required.',
        short: 'Password must be stronger',
      };
    case Condition.IsTags:
      return { long: 'Input value is not valid tags.', short: 'Invalid tags' };
    case Condition.IsTaxIDNumber:
      return {
        long: 'Value is not a valid tax ID number.',
        short: 'Invalid tax ID number',
      };
    case Condition.IsThisMonth:
      return {
        long: 'Date is not in the current month.',
        short: 'Not current month',
      };
    case Condition.IsThisQuarter:
      return {
        long: 'Date is not in the current quarter.',
        short: 'Not current quarter',
      };
    case Condition.IsThisWeek:
      return { long: 'Date is not this week.', short: 'Not this week' };
    case Condition.IsThisWeekend:
      return {
        long: 'Date is not date for upcoming weekend.',
        short: 'Not this weekend',
      };
    case Condition.IsThisYear:
      return {
        long: 'Date is not in the current year.',
        short: 'Not in current year',
      };
    case Condition.IsTime:
      return {
        long: 'Value is not a valid time string.',
        short: 'Invalid time',
      };
    case Condition.IsTimeOfDay:
      return {
        long: 'Value is not in required time of day.',
        short: 'Invalid time of day',
      };
    case Condition.IsTimeRange:
      return {
        long: 'Value is not a valid time range.',
        short: 'Invalid time range',
      };
    case Condition.IsToday:
      return { long: 'Date is not today.', short: "Not today's date" };
    case Condition.IsURL:
      return { long: 'Value is not a valid URL string.', short: 'Invalid URL' };
    case Condition.IsUUID:
      return {
        long: 'Value is not a valid UUID string.',
        short: 'Invalid UUID',
      };
    case Condition.IsUppercase:
      return {
        long: 'String is not completely uppercased.',
        short: 'Not uppercase',
      };
    case Condition.IsUsernameAvailable:
      return {
        long: 'Username is not available.',
        short: 'Username not available',
      };
    case Condition.IsValidStreetAddress:
      return {
        long: 'Provided address is not valid.',
        short: 'Invalid street address',
      };
    case Condition.IsVATIDNumber:
      return {
        long: 'Value is not a valid VAT ID number.',
        short: 'Invalid VAT ID',
      };
    case Condition.IsWeekday:
      return { long: 'Date is not a weekday.', short: 'Not a weekday' };
    case Condition.IsWeekend:
      return { long: 'Date is not on a weekend.', short: 'Not a weekend' };
    case Condition.IsYear:
      return { long: 'Not a valid year string.', short: 'Invalid year' };
  }
}

/*
Contains = "contains",
    HasCharacterCount = "has-character-count",
    HasNumberCount = "has-number-count",
    HasLetterCount = "has-letter-count",
    HasLowercaseCount = "has-lowercase-count",
    HasSpacesCount = "has-spaces-count",
    HasSymbolCount = "has-symbol-count",
    HasUppercaseCount = "has-uppercase-count",
    IsAfter = "is-after",
    IsAfterOrEqual = "is-after-or-equal",
    IsAirport = "is-airport",
    IsAlpha = "is-alpha",
    IsAlphanumeric = "is-alphanumeric",
    IsAlgorithmHash = "is-algorithm-hash",
    IsAscii = "is-ascii",
    IsBase64 = "is-base-64",
    IsBefore = "is-before",
    IsBeforeOrAfter = "is-before-or-after",
    IsBeforeOrEqual = "is-before-or-equal",
    IsBetween = "is-between",
    IsBIC = "is-bic",
    IsBitcoinAddress = "is-bitcoin-address",
    IsBoolean = "is-boolean",
    IsColor = "is-color",
    IsComplexEnough = "is-complex-enough",
    IsCountry = "is-country",
    IsCreditCard = "is-credit-card",
    IsCurrency = "is-currency",
    IsDataURI = "is-data-uri",
    IsDate = "is-date",
    IsDateRange = "is-date-range",
    IsDateTime = "is-date-time",
    IsDayOfMonth = "is-day-of-month",
    IsNotDayOfMonth = "is-not-day-of-month",
    IsDecimal = "is-decimal",
    IsDivisibleBy = "is-divisible-by",
    IsDomainName = "is-domain-name",
    IsEmailAddress = "is-email-address",
    IsEthereumAddress = "is-ethereum-address",
    IsEAN = "is-ean",
    IsEIN = "is-ein",
    IsEqual = "is-equal",
    IsEvenNumber = "is-even-number",
    IsFloat = "is-float",
    IsIBAN = "is-iban",
    IsGreaterThan = "greater-than",
    IsGreaterThanOrEqual = "greater-than-or-equal",
    IsHSLColor = "is-hsl-color",
    isHexColor = "is-hex-color",
    IsHexadecimal = "is-hexadecimal",
    IsIdentityCardCode = "is-identity-card-code",
    IsIMEI = "is-imei",
    IsInIPAddressRange = "is-in-ip-address-range",
    IsInList = "is-in-list",
    IsInTheLast = "is-in-the-last",
    IsInteger = "is-integer",
    IsIPAddress = "is-ip-address",
    IsIPAddressRange = "is-ip-address-range",
    IsISBN = "is-isbn",
    IsISIN = "is-isin",
    IsISMN = "is-ismn",
    IsISRC = "is-isrc",
    IsISSN = "is-issn",
    IsISO4217 = "is-iso-4217",
    IsISO8601 = "is-iso-8601",
    IsISO31661Alpha2 = "is-iso-31661-alpha-2",
    IsISO31661Alpha3 = "is-iso-31661-alpha-3",
    IsJSON = "is-json",
    IsLanguage = "is-language",
    IsLatitude = "is-latitude",
    IsLongitude = "is-longitude",
    IsLengthEqual = "is-length-equal",
    IsLengthGreaterThan = "is-length-greater-than",
    IsLengthGreaterThanOrEqual = "is-length-great-than-or-equal",
    IsLengthLessThan = "is-length-less-than",
    IsLengthLessThanOrEqual = "is-length-less-than-or-equal",
    IsLessThan = "less-than",
    IsLessThanOrEqual = "less-than-or-equal",
    IsLicensePlateNumber = "is-license-plate-number",
    IsLowercase = "is-lowercase",
    IsOctal = "is-octal",
    IsMACAddress = "is-mac-address",
    IsMD5 = "is-md5",
    IsMagnetURI = "is-magnet-uri",
    IsMarkdown = "is-markdown",
    IsMimeType = "is-mime-type",
    IsMonth = "is-month",
    IsNegativeNumber = "is-negative-number",
    IsNotDate = "is-not-date",
    IsNotEqual = "is-not-equal",
    IsNotInIPAddressRange = "is-not-in-ip-address-range",
    IsNotInList = "is-not-in-list",
    IsNotNull = "is-not-null",
    IsNotRegexMatch = "is-not-regex-match",
    IsNotToday = "is-not-today",
    IsNull = "is-null",
    IsNumber = "is-number",
    IsNumeric = "is-numeric",
    IsOddNumber = "is-odd-number",
    IsPassportNumber = "is-passport-number",
    IsPhoneNumber = "is-phone-number",
    IsPort = "is-port",
    IsPositiveNumber = "is-positive-number",
    IsPostalCode = "is-postal-code",
    IsProvince = "is-province",
    IsRGBColor = "is-rgb-color",
    IsRegexMatch = "is-regex-match",
    IsSemanticVersion = "is-semantic-version",
    IsSlug = "is-slug",
    IsSSN = "is-ssn",
    IsState = "is-state",
    IsStreetAddress = "is-street-address",
    IsString = "is-string",
    IsStrongPassword = "is-strong-password",
    IsTags = "is-tags",
    IsTaxIDNumber = "is-tax-id-number",
    IsThisMonth = "is-this-month",
    IsThisQuarter = "is-this-quarter",
    IsThisWeek = "is-this-week",
    IsThisWeekend = "is-this-weekend",
    IsThisYear = "is-this-year",
    IsTime = "is-time",
    IsTimeOfDay = "is-time-of-day",
    IsTimeRange = "is-time-range",
    IsToday = "is-today",
    IsURL = "is-url",
    IsUUID = "is-uuid",
    IsUppercase = "is-uppercase",
    IsValidStreetAddress = "is-valid-street-address",
    IsVATIDNumber = "is-vat-id-number",
    IsWeekday = "is-weekday",
    IsWeekend = "is-weekend",
    IsYear = "is-year"
    */
