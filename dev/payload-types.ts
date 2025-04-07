/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * Supported timezones in IANA format.
 *
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "supportedTimezones".
 */
export type SupportedTimezones =
  | 'Pacific/Midway'
  | 'Pacific/Niue'
  | 'Pacific/Honolulu'
  | 'Pacific/Rarotonga'
  | 'America/Anchorage'
  | 'Pacific/Gambier'
  | 'America/Los_Angeles'
  | 'America/Tijuana'
  | 'America/Denver'
  | 'America/Phoenix'
  | 'America/Chicago'
  | 'America/Guatemala'
  | 'America/New_York'
  | 'America/Bogota'
  | 'America/Caracas'
  | 'America/Santiago'
  | 'America/Buenos_Aires'
  | 'America/Sao_Paulo'
  | 'Atlantic/South_Georgia'
  | 'Atlantic/Azores'
  | 'Atlantic/Cape_Verde'
  | 'Europe/London'
  | 'Europe/Berlin'
  | 'Africa/Lagos'
  | 'Europe/Athens'
  | 'Africa/Cairo'
  | 'Europe/Moscow'
  | 'Asia/Riyadh'
  | 'Asia/Dubai'
  | 'Asia/Baku'
  | 'Asia/Karachi'
  | 'Asia/Tashkent'
  | 'Asia/Calcutta'
  | 'Asia/Dhaka'
  | 'Asia/Almaty'
  | 'Asia/Jakarta'
  | 'Asia/Bangkok'
  | 'Asia/Shanghai'
  | 'Asia/Singapore'
  | 'Asia/Tokyo'
  | 'Asia/Seoul'
  | 'Australia/Brisbane'
  | 'Australia/Sydney'
  | 'Pacific/Guam'
  | 'Pacific/Noumea'
  | 'Pacific/Auckland'
  | 'Pacific/Fiji';

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  blocks: {};
  collections: {
    posts: Post;
    media: Media;
    'razorpay-orders': RazorpayOrder;
    'razorpay-transactions': RazorpayTransaction;
    'razorpay-refunds': RazorpayRefund;
    'razorpay-logs': RazorpayLog;
    users: User;
    'payload-locked-documents': PayloadLockedDocument;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  collectionsJoins: {};
  collectionsSelect: {
    posts: PostsSelect<false> | PostsSelect<true>;
    media: MediaSelect<false> | MediaSelect<true>;
    'razorpay-orders': RazorpayOrdersSelect<false> | RazorpayOrdersSelect<true>;
    'razorpay-transactions': RazorpayTransactionsSelect<false> | RazorpayTransactionsSelect<true>;
    'razorpay-refunds': RazorpayRefundsSelect<false> | RazorpayRefundsSelect<true>;
    'razorpay-logs': RazorpayLogsSelect<false> | RazorpayLogsSelect<true>;
    users: UsersSelect<false> | UsersSelect<true>;
    'payload-locked-documents': PayloadLockedDocumentsSelect<false> | PayloadLockedDocumentsSelect<true>;
    'payload-preferences': PayloadPreferencesSelect<false> | PayloadPreferencesSelect<true>;
    'payload-migrations': PayloadMigrationsSelect<false> | PayloadMigrationsSelect<true>;
  };
  db: {
    defaultIDType: number;
  };
  globals: {};
  globalsSelect: {};
  locale: null;
  user: User & {
    collection: 'users';
  };
  jobs: {
    tasks: unknown;
    workflows: unknown;
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "posts".
 */
export interface Post {
  id: number;
  title: string;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: number;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "razorpay-orders".
 */
export interface RazorpayOrder {
  id: number;
  payment: {
    status: 'created' | 'authorized' | 'captured' | 'pending' | 'paid' | 'failed' | 'refunded';
    /**
     * Amount in smallest currency unit (paise)
     */
    amount: number;
    currency: string;
    /**
     * Razorpay Order ID
     */
    razorpay_order_id?: string | null;
    /**
     * Related payment transactions
     */
    transactions?: (number | RazorpayTransaction)[] | null;
    /**
     * Related refunds
     */
    refunds?: (number | RazorpayRefund)[] | null;
    /**
     * Razorpay Order Payload
     */
    order_payload?:
      | {
          [k: string]: unknown;
        }
      | unknown[]
      | string
      | number
      | boolean
      | null;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "razorpay-transactions".
 */
export interface RazorpayTransaction {
  id: number;
  /**
   * Razorpay Payment ID
   */
  razorpay_payment_id?: string | null;
  /**
   * Razorpay Order ID
   */
  razorpay_order_id: string;
  /**
   * Amount in smallest currency unit (paise)
   */
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';
  method?: ('card' | 'netbanking' | 'upi' | 'wallet' | 'emi') | null;
  /**
   * Related order
   */
  order?: (number | null) | RazorpayOrder;
  customer?: {
    email?: string | null;
    name?: string | null;
    contact?: string | null;
  };
  /**
   * Additional notes or metadata
   */
  notes?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  error?: {
    code?: string | null;
    description?: string | null;
    source?: string | null;
    step?: string | null;
    reason?: string | null;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "razorpay-refunds".
 */
export interface RazorpayRefund {
  id: number;
  /**
   * Razorpay Refund ID
   */
  razorpay_refund_id: string;
  /**
   * Original Payment ID
   */
  razorpay_payment_id: string;
  /**
   * Refund amount in smallest currency unit (paise)
   */
  amount: number;
  status: 'pending' | 'processed' | 'failed';
  speed: 'normal' | 'optimum';
  receipt?: string | null;
  /**
   * Related transaction
   */
  transaction: number | RazorpayTransaction;
  /**
   * Additional notes or metadata
   */
  notes?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  error?: {
    code?: string | null;
    description?: string | null;
    source?: string | null;
    reason?: string | null;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "razorpay-logs".
 */
export interface RazorpayLog {
  id: number;
  event: string;
  payload:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: number;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents".
 */
export interface PayloadLockedDocument {
  id: number;
  document?:
    | ({
        relationTo: 'posts';
        value: number | Post;
      } | null)
    | ({
        relationTo: 'media';
        value: number | Media;
      } | null)
    | ({
        relationTo: 'razorpay-orders';
        value: number | RazorpayOrder;
      } | null)
    | ({
        relationTo: 'razorpay-transactions';
        value: number | RazorpayTransaction;
      } | null)
    | ({
        relationTo: 'razorpay-refunds';
        value: number | RazorpayRefund;
      } | null)
    | ({
        relationTo: 'razorpay-logs';
        value: number | RazorpayLog;
      } | null)
    | ({
        relationTo: 'users';
        value: number | User;
      } | null);
  globalSlug?: string | null;
  user: {
    relationTo: 'users';
    value: number | User;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: number;
  user: {
    relationTo: 'users';
    value: number | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: number;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "posts_select".
 */
export interface PostsSelect<T extends boolean = true> {
  title?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media_select".
 */
export interface MediaSelect<T extends boolean = true> {
  updatedAt?: T;
  createdAt?: T;
  url?: T;
  thumbnailURL?: T;
  filename?: T;
  mimeType?: T;
  filesize?: T;
  width?: T;
  height?: T;
  focalX?: T;
  focalY?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "razorpay-orders_select".
 */
export interface RazorpayOrdersSelect<T extends boolean = true> {
  payment?:
    | T
    | {
        status?: T;
        amount?: T;
        currency?: T;
        razorpay_order_id?: T;
        transactions?: T;
        refunds?: T;
        order_payload?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "razorpay-transactions_select".
 */
export interface RazorpayTransactionsSelect<T extends boolean = true> {
  razorpay_payment_id?: T;
  razorpay_order_id?: T;
  amount?: T;
  currency?: T;
  status?: T;
  method?: T;
  order?: T;
  customer?:
    | T
    | {
        email?: T;
        name?: T;
        contact?: T;
      };
  notes?: T;
  error?:
    | T
    | {
        code?: T;
        description?: T;
        source?: T;
        step?: T;
        reason?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "razorpay-refunds_select".
 */
export interface RazorpayRefundsSelect<T extends boolean = true> {
  razorpay_refund_id?: T;
  razorpay_payment_id?: T;
  amount?: T;
  status?: T;
  speed?: T;
  receipt?: T;
  transaction?: T;
  notes?: T;
  error?:
    | T
    | {
        code?: T;
        description?: T;
        source?: T;
        reason?: T;
      };
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "razorpay-logs_select".
 */
export interface RazorpayLogsSelect<T extends boolean = true> {
  event?: T;
  payload?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users_select".
 */
export interface UsersSelect<T extends boolean = true> {
  updatedAt?: T;
  createdAt?: T;
  email?: T;
  resetPasswordToken?: T;
  resetPasswordExpiration?: T;
  salt?: T;
  hash?: T;
  loginAttempts?: T;
  lockUntil?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-locked-documents_select".
 */
export interface PayloadLockedDocumentsSelect<T extends boolean = true> {
  document?: T;
  globalSlug?: T;
  user?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences_select".
 */
export interface PayloadPreferencesSelect<T extends boolean = true> {
  user?: T;
  key?: T;
  value?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations_select".
 */
export interface PayloadMigrationsSelect<T extends boolean = true> {
  name?: T;
  batch?: T;
  updatedAt?: T;
  createdAt?: T;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}