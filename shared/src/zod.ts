import { z } from 'zod';

// Base validators
export const zStringRequired = z
  .string({ required_error: 'Required' })
  .min(1, 'Required');

export const zStringOptional = z.string().optional();

export const zNumberRequired = z
  .number({
    required_error: 'Required',
  })
  .min(1, 'Required');

// String length validators
export const zStringMin = (min: number, message?: string) =>
  zStringRequired.min(
    min,
    `${message || 'Must be at least'} ${min} characters`
  );

export const zStringMax = (max: number, message?: string) =>
  zStringRequired.max(max, `${message || 'Must be at most'} ${max} characters`);

// Environment validators
export const zEnvNonemptyTrimmed = z.string().trim().min(1);

export const zEnvNonemptyTrimmedRequiredOnNotLocal = zEnvNonemptyTrimmed
  .optional()
  .refine(
    // eslint-disable-next-line node/no-process-env
    (val) => process.env.HOST_ENV === 'local' || !!val,
    'Required on local host'
  );

export const zEnvEnum = z.enum(['local', 'production']);

// Name and email validators
export const zNameRequired = zStringRequired
  .min(3, 'Name must be at least 3 characters')
  .max(50, 'Name must be at most 50 characters')
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'Name can only contain letters, numbers and underscores'
  );

export const zNameOptional = z
  .string()
  .min(3, 'Name is too short')
  .max(50, 'Name is too long')
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'Name can only contain letters, numbers and underscores'
  )
  .optional();

export const zEmailRequired = zStringRequired.email(
  'Email must be a valid email address'
);

// Special validators
export const zStatusRequired = z.enum(['IN_PROGRESS', 'COMPLETED', 'FAILED']);
export const zLimitRequired = zNumberRequired.min(1).max(100).default(10);
export const zCursorOptional = z.coerce.number().optional();

// Helper functions
export const zPasswordsMustBeTheSame =
  (passwordFieldName: string, passwordAgainFieldName: string) =>
  (val: any, ctx: z.RefinementCtx) => {
    if (val[passwordFieldName] !== val[passwordAgainFieldName]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: [passwordAgainFieldName],
      });
    }
  };
