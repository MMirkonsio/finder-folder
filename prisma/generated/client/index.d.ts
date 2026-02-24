
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model FileRecord
 * 
 */
export type FileRecord = $Result.DefaultSelection<Prisma.$FileRecordPayload>
/**
 * Model ServerConfig
 * 
 */
export type ServerConfig = $Result.DefaultSelection<Prisma.$ServerConfigPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more FileRecords
 * const fileRecords = await prisma.fileRecord.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more FileRecords
   * const fileRecords = await prisma.fileRecord.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.fileRecord`: Exposes CRUD operations for the **FileRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FileRecords
    * const fileRecords = await prisma.fileRecord.findMany()
    * ```
    */
  get fileRecord(): Prisma.FileRecordDelegate<ExtArgs>;

  /**
   * `prisma.serverConfig`: Exposes CRUD operations for the **ServerConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ServerConfigs
    * const serverConfigs = await prisma.serverConfig.findMany()
    * ```
    */
  get serverConfig(): Prisma.ServerConfigDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    FileRecord: 'FileRecord',
    ServerConfig: 'ServerConfig'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "fileRecord" | "serverConfig"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      FileRecord: {
        payload: Prisma.$FileRecordPayload<ExtArgs>
        fields: Prisma.FileRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FileRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FileRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileRecordPayload>
          }
          findFirst: {
            args: Prisma.FileRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FileRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileRecordPayload>
          }
          findMany: {
            args: Prisma.FileRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileRecordPayload>[]
          }
          create: {
            args: Prisma.FileRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileRecordPayload>
          }
          createMany: {
            args: Prisma.FileRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FileRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileRecordPayload>[]
          }
          delete: {
            args: Prisma.FileRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileRecordPayload>
          }
          update: {
            args: Prisma.FileRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileRecordPayload>
          }
          deleteMany: {
            args: Prisma.FileRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FileRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FileRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FileRecordPayload>
          }
          aggregate: {
            args: Prisma.FileRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFileRecord>
          }
          groupBy: {
            args: Prisma.FileRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<FileRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.FileRecordCountArgs<ExtArgs>
            result: $Utils.Optional<FileRecordCountAggregateOutputType> | number
          }
        }
      }
      ServerConfig: {
        payload: Prisma.$ServerConfigPayload<ExtArgs>
        fields: Prisma.ServerConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ServerConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServerConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ServerConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServerConfigPayload>
          }
          findFirst: {
            args: Prisma.ServerConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServerConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ServerConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServerConfigPayload>
          }
          findMany: {
            args: Prisma.ServerConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServerConfigPayload>[]
          }
          create: {
            args: Prisma.ServerConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServerConfigPayload>
          }
          createMany: {
            args: Prisma.ServerConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ServerConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServerConfigPayload>[]
          }
          delete: {
            args: Prisma.ServerConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServerConfigPayload>
          }
          update: {
            args: Prisma.ServerConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServerConfigPayload>
          }
          deleteMany: {
            args: Prisma.ServerConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ServerConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ServerConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ServerConfigPayload>
          }
          aggregate: {
            args: Prisma.ServerConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateServerConfig>
          }
          groupBy: {
            args: Prisma.ServerConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<ServerConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.ServerConfigCountArgs<ExtArgs>
            result: $Utils.Optional<ServerConfigCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model FileRecord
   */

  export type AggregateFileRecord = {
    _count: FileRecordCountAggregateOutputType | null
    _avg: FileRecordAvgAggregateOutputType | null
    _sum: FileRecordSumAggregateOutputType | null
    _min: FileRecordMinAggregateOutputType | null
    _max: FileRecordMaxAggregateOutputType | null
  }

  export type FileRecordAvgAggregateOutputType = {
    file_size: number | null
  }

  export type FileRecordSumAggregateOutputType = {
    file_size: number | null
  }

  export type FileRecordMinAggregateOutputType = {
    id: string | null
    file_name: string | null
    file_path: string | null
    file_size: number | null
    file_type: string | null
    owner_user: string | null
    last_modified: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type FileRecordMaxAggregateOutputType = {
    id: string | null
    file_name: string | null
    file_path: string | null
    file_size: number | null
    file_type: string | null
    owner_user: string | null
    last_modified: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type FileRecordCountAggregateOutputType = {
    id: number
    file_name: number
    file_path: number
    file_size: number
    file_type: number
    owner_user: number
    last_modified: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type FileRecordAvgAggregateInputType = {
    file_size?: true
  }

  export type FileRecordSumAggregateInputType = {
    file_size?: true
  }

  export type FileRecordMinAggregateInputType = {
    id?: true
    file_name?: true
    file_path?: true
    file_size?: true
    file_type?: true
    owner_user?: true
    last_modified?: true
    created_at?: true
    updated_at?: true
  }

  export type FileRecordMaxAggregateInputType = {
    id?: true
    file_name?: true
    file_path?: true
    file_size?: true
    file_type?: true
    owner_user?: true
    last_modified?: true
    created_at?: true
    updated_at?: true
  }

  export type FileRecordCountAggregateInputType = {
    id?: true
    file_name?: true
    file_path?: true
    file_size?: true
    file_type?: true
    owner_user?: true
    last_modified?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type FileRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileRecord to aggregate.
     */
    where?: FileRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileRecords to fetch.
     */
    orderBy?: FileRecordOrderByWithRelationInput | FileRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FileRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FileRecords
    **/
    _count?: true | FileRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FileRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FileRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FileRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FileRecordMaxAggregateInputType
  }

  export type GetFileRecordAggregateType<T extends FileRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateFileRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFileRecord[P]>
      : GetScalarType<T[P], AggregateFileRecord[P]>
  }




  export type FileRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FileRecordWhereInput
    orderBy?: FileRecordOrderByWithAggregationInput | FileRecordOrderByWithAggregationInput[]
    by: FileRecordScalarFieldEnum[] | FileRecordScalarFieldEnum
    having?: FileRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FileRecordCountAggregateInputType | true
    _avg?: FileRecordAvgAggregateInputType
    _sum?: FileRecordSumAggregateInputType
    _min?: FileRecordMinAggregateInputType
    _max?: FileRecordMaxAggregateInputType
  }

  export type FileRecordGroupByOutputType = {
    id: string
    file_name: string
    file_path: string
    file_size: number
    file_type: string
    owner_user: string | null
    last_modified: Date
    created_at: Date
    updated_at: Date
    _count: FileRecordCountAggregateOutputType | null
    _avg: FileRecordAvgAggregateOutputType | null
    _sum: FileRecordSumAggregateOutputType | null
    _min: FileRecordMinAggregateOutputType | null
    _max: FileRecordMaxAggregateOutputType | null
  }

  type GetFileRecordGroupByPayload<T extends FileRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FileRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FileRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FileRecordGroupByOutputType[P]>
            : GetScalarType<T[P], FileRecordGroupByOutputType[P]>
        }
      >
    >


  export type FileRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    file_name?: boolean
    file_path?: boolean
    file_size?: boolean
    file_type?: boolean
    owner_user?: boolean
    last_modified?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["fileRecord"]>

  export type FileRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    file_name?: boolean
    file_path?: boolean
    file_size?: boolean
    file_type?: boolean
    owner_user?: boolean
    last_modified?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["fileRecord"]>

  export type FileRecordSelectScalar = {
    id?: boolean
    file_name?: boolean
    file_path?: boolean
    file_size?: boolean
    file_type?: boolean
    owner_user?: boolean
    last_modified?: boolean
    created_at?: boolean
    updated_at?: boolean
  }


  export type $FileRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FileRecord"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      file_name: string
      file_path: string
      file_size: number
      file_type: string
      owner_user: string | null
      last_modified: Date
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["fileRecord"]>
    composites: {}
  }

  type FileRecordGetPayload<S extends boolean | null | undefined | FileRecordDefaultArgs> = $Result.GetResult<Prisma.$FileRecordPayload, S>

  type FileRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FileRecordFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FileRecordCountAggregateInputType | true
    }

  export interface FileRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FileRecord'], meta: { name: 'FileRecord' } }
    /**
     * Find zero or one FileRecord that matches the filter.
     * @param {FileRecordFindUniqueArgs} args - Arguments to find a FileRecord
     * @example
     * // Get one FileRecord
     * const fileRecord = await prisma.fileRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FileRecordFindUniqueArgs>(args: SelectSubset<T, FileRecordFindUniqueArgs<ExtArgs>>): Prisma__FileRecordClient<$Result.GetResult<Prisma.$FileRecordPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one FileRecord that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FileRecordFindUniqueOrThrowArgs} args - Arguments to find a FileRecord
     * @example
     * // Get one FileRecord
     * const fileRecord = await prisma.fileRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FileRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, FileRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FileRecordClient<$Result.GetResult<Prisma.$FileRecordPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first FileRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileRecordFindFirstArgs} args - Arguments to find a FileRecord
     * @example
     * // Get one FileRecord
     * const fileRecord = await prisma.fileRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FileRecordFindFirstArgs>(args?: SelectSubset<T, FileRecordFindFirstArgs<ExtArgs>>): Prisma__FileRecordClient<$Result.GetResult<Prisma.$FileRecordPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first FileRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileRecordFindFirstOrThrowArgs} args - Arguments to find a FileRecord
     * @example
     * // Get one FileRecord
     * const fileRecord = await prisma.fileRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FileRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, FileRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__FileRecordClient<$Result.GetResult<Prisma.$FileRecordPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more FileRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FileRecords
     * const fileRecords = await prisma.fileRecord.findMany()
     * 
     * // Get first 10 FileRecords
     * const fileRecords = await prisma.fileRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fileRecordWithIdOnly = await prisma.fileRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FileRecordFindManyArgs>(args?: SelectSubset<T, FileRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileRecordPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a FileRecord.
     * @param {FileRecordCreateArgs} args - Arguments to create a FileRecord.
     * @example
     * // Create one FileRecord
     * const FileRecord = await prisma.fileRecord.create({
     *   data: {
     *     // ... data to create a FileRecord
     *   }
     * })
     * 
     */
    create<T extends FileRecordCreateArgs>(args: SelectSubset<T, FileRecordCreateArgs<ExtArgs>>): Prisma__FileRecordClient<$Result.GetResult<Prisma.$FileRecordPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many FileRecords.
     * @param {FileRecordCreateManyArgs} args - Arguments to create many FileRecords.
     * @example
     * // Create many FileRecords
     * const fileRecord = await prisma.fileRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FileRecordCreateManyArgs>(args?: SelectSubset<T, FileRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FileRecords and returns the data saved in the database.
     * @param {FileRecordCreateManyAndReturnArgs} args - Arguments to create many FileRecords.
     * @example
     * // Create many FileRecords
     * const fileRecord = await prisma.fileRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FileRecords and only return the `id`
     * const fileRecordWithIdOnly = await prisma.fileRecord.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FileRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, FileRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FileRecordPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a FileRecord.
     * @param {FileRecordDeleteArgs} args - Arguments to delete one FileRecord.
     * @example
     * // Delete one FileRecord
     * const FileRecord = await prisma.fileRecord.delete({
     *   where: {
     *     // ... filter to delete one FileRecord
     *   }
     * })
     * 
     */
    delete<T extends FileRecordDeleteArgs>(args: SelectSubset<T, FileRecordDeleteArgs<ExtArgs>>): Prisma__FileRecordClient<$Result.GetResult<Prisma.$FileRecordPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one FileRecord.
     * @param {FileRecordUpdateArgs} args - Arguments to update one FileRecord.
     * @example
     * // Update one FileRecord
     * const fileRecord = await prisma.fileRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FileRecordUpdateArgs>(args: SelectSubset<T, FileRecordUpdateArgs<ExtArgs>>): Prisma__FileRecordClient<$Result.GetResult<Prisma.$FileRecordPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more FileRecords.
     * @param {FileRecordDeleteManyArgs} args - Arguments to filter FileRecords to delete.
     * @example
     * // Delete a few FileRecords
     * const { count } = await prisma.fileRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FileRecordDeleteManyArgs>(args?: SelectSubset<T, FileRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FileRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FileRecords
     * const fileRecord = await prisma.fileRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FileRecordUpdateManyArgs>(args: SelectSubset<T, FileRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FileRecord.
     * @param {FileRecordUpsertArgs} args - Arguments to update or create a FileRecord.
     * @example
     * // Update or create a FileRecord
     * const fileRecord = await prisma.fileRecord.upsert({
     *   create: {
     *     // ... data to create a FileRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FileRecord we want to update
     *   }
     * })
     */
    upsert<T extends FileRecordUpsertArgs>(args: SelectSubset<T, FileRecordUpsertArgs<ExtArgs>>): Prisma__FileRecordClient<$Result.GetResult<Prisma.$FileRecordPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of FileRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileRecordCountArgs} args - Arguments to filter FileRecords to count.
     * @example
     * // Count the number of FileRecords
     * const count = await prisma.fileRecord.count({
     *   where: {
     *     // ... the filter for the FileRecords we want to count
     *   }
     * })
    **/
    count<T extends FileRecordCountArgs>(
      args?: Subset<T, FileRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FileRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FileRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FileRecordAggregateArgs>(args: Subset<T, FileRecordAggregateArgs>): Prisma.PrismaPromise<GetFileRecordAggregateType<T>>

    /**
     * Group by FileRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FileRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FileRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FileRecordGroupByArgs['orderBy'] }
        : { orderBy?: FileRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FileRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFileRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FileRecord model
   */
  readonly fields: FileRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FileRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FileRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FileRecord model
   */ 
  interface FileRecordFieldRefs {
    readonly id: FieldRef<"FileRecord", 'String'>
    readonly file_name: FieldRef<"FileRecord", 'String'>
    readonly file_path: FieldRef<"FileRecord", 'String'>
    readonly file_size: FieldRef<"FileRecord", 'Int'>
    readonly file_type: FieldRef<"FileRecord", 'String'>
    readonly owner_user: FieldRef<"FileRecord", 'String'>
    readonly last_modified: FieldRef<"FileRecord", 'DateTime'>
    readonly created_at: FieldRef<"FileRecord", 'DateTime'>
    readonly updated_at: FieldRef<"FileRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FileRecord findUnique
   */
  export type FileRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRecord
     */
    select?: FileRecordSelect<ExtArgs> | null
    /**
     * Filter, which FileRecord to fetch.
     */
    where: FileRecordWhereUniqueInput
  }

  /**
   * FileRecord findUniqueOrThrow
   */
  export type FileRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRecord
     */
    select?: FileRecordSelect<ExtArgs> | null
    /**
     * Filter, which FileRecord to fetch.
     */
    where: FileRecordWhereUniqueInput
  }

  /**
   * FileRecord findFirst
   */
  export type FileRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRecord
     */
    select?: FileRecordSelect<ExtArgs> | null
    /**
     * Filter, which FileRecord to fetch.
     */
    where?: FileRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileRecords to fetch.
     */
    orderBy?: FileRecordOrderByWithRelationInput | FileRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileRecords.
     */
    cursor?: FileRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileRecords.
     */
    distinct?: FileRecordScalarFieldEnum | FileRecordScalarFieldEnum[]
  }

  /**
   * FileRecord findFirstOrThrow
   */
  export type FileRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRecord
     */
    select?: FileRecordSelect<ExtArgs> | null
    /**
     * Filter, which FileRecord to fetch.
     */
    where?: FileRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileRecords to fetch.
     */
    orderBy?: FileRecordOrderByWithRelationInput | FileRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FileRecords.
     */
    cursor?: FileRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FileRecords.
     */
    distinct?: FileRecordScalarFieldEnum | FileRecordScalarFieldEnum[]
  }

  /**
   * FileRecord findMany
   */
  export type FileRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRecord
     */
    select?: FileRecordSelect<ExtArgs> | null
    /**
     * Filter, which FileRecords to fetch.
     */
    where?: FileRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FileRecords to fetch.
     */
    orderBy?: FileRecordOrderByWithRelationInput | FileRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FileRecords.
     */
    cursor?: FileRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FileRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FileRecords.
     */
    skip?: number
    distinct?: FileRecordScalarFieldEnum | FileRecordScalarFieldEnum[]
  }

  /**
   * FileRecord create
   */
  export type FileRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRecord
     */
    select?: FileRecordSelect<ExtArgs> | null
    /**
     * The data needed to create a FileRecord.
     */
    data: XOR<FileRecordCreateInput, FileRecordUncheckedCreateInput>
  }

  /**
   * FileRecord createMany
   */
  export type FileRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FileRecords.
     */
    data: FileRecordCreateManyInput | FileRecordCreateManyInput[]
  }

  /**
   * FileRecord createManyAndReturn
   */
  export type FileRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRecord
     */
    select?: FileRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many FileRecords.
     */
    data: FileRecordCreateManyInput | FileRecordCreateManyInput[]
  }

  /**
   * FileRecord update
   */
  export type FileRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRecord
     */
    select?: FileRecordSelect<ExtArgs> | null
    /**
     * The data needed to update a FileRecord.
     */
    data: XOR<FileRecordUpdateInput, FileRecordUncheckedUpdateInput>
    /**
     * Choose, which FileRecord to update.
     */
    where: FileRecordWhereUniqueInput
  }

  /**
   * FileRecord updateMany
   */
  export type FileRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FileRecords.
     */
    data: XOR<FileRecordUpdateManyMutationInput, FileRecordUncheckedUpdateManyInput>
    /**
     * Filter which FileRecords to update
     */
    where?: FileRecordWhereInput
  }

  /**
   * FileRecord upsert
   */
  export type FileRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRecord
     */
    select?: FileRecordSelect<ExtArgs> | null
    /**
     * The filter to search for the FileRecord to update in case it exists.
     */
    where: FileRecordWhereUniqueInput
    /**
     * In case the FileRecord found by the `where` argument doesn't exist, create a new FileRecord with this data.
     */
    create: XOR<FileRecordCreateInput, FileRecordUncheckedCreateInput>
    /**
     * In case the FileRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FileRecordUpdateInput, FileRecordUncheckedUpdateInput>
  }

  /**
   * FileRecord delete
   */
  export type FileRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRecord
     */
    select?: FileRecordSelect<ExtArgs> | null
    /**
     * Filter which FileRecord to delete.
     */
    where: FileRecordWhereUniqueInput
  }

  /**
   * FileRecord deleteMany
   */
  export type FileRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FileRecords to delete
     */
    where?: FileRecordWhereInput
  }

  /**
   * FileRecord without action
   */
  export type FileRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FileRecord
     */
    select?: FileRecordSelect<ExtArgs> | null
  }


  /**
   * Model ServerConfig
   */

  export type AggregateServerConfig = {
    _count: ServerConfigCountAggregateOutputType | null
    _avg: ServerConfigAvgAggregateOutputType | null
    _sum: ServerConfigSumAggregateOutputType | null
    _min: ServerConfigMinAggregateOutputType | null
    _max: ServerConfigMaxAggregateOutputType | null
  }

  export type ServerConfigAvgAggregateOutputType = {
    total_files: number | null
  }

  export type ServerConfigSumAggregateOutputType = {
    total_files: number | null
  }

  export type ServerConfigMinAggregateOutputType = {
    id: string | null
    server_url: string | null
    root_path: string | null
    root_path_2: string | null
    root_path_3: string | null
    root_path_4: string | null
    root_path_5: string | null
    root_path_6: string | null
    root_path_7: string | null
    root_path_8: string | null
    root_path_9: string | null
    root_path_10: string | null
    last_scan: Date | null
    total_files: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ServerConfigMaxAggregateOutputType = {
    id: string | null
    server_url: string | null
    root_path: string | null
    root_path_2: string | null
    root_path_3: string | null
    root_path_4: string | null
    root_path_5: string | null
    root_path_6: string | null
    root_path_7: string | null
    root_path_8: string | null
    root_path_9: string | null
    root_path_10: string | null
    last_scan: Date | null
    total_files: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ServerConfigCountAggregateOutputType = {
    id: number
    server_url: number
    root_path: number
    root_path_2: number
    root_path_3: number
    root_path_4: number
    root_path_5: number
    root_path_6: number
    root_path_7: number
    root_path_8: number
    root_path_9: number
    root_path_10: number
    last_scan: number
    total_files: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ServerConfigAvgAggregateInputType = {
    total_files?: true
  }

  export type ServerConfigSumAggregateInputType = {
    total_files?: true
  }

  export type ServerConfigMinAggregateInputType = {
    id?: true
    server_url?: true
    root_path?: true
    root_path_2?: true
    root_path_3?: true
    root_path_4?: true
    root_path_5?: true
    root_path_6?: true
    root_path_7?: true
    root_path_8?: true
    root_path_9?: true
    root_path_10?: true
    last_scan?: true
    total_files?: true
    created_at?: true
    updated_at?: true
  }

  export type ServerConfigMaxAggregateInputType = {
    id?: true
    server_url?: true
    root_path?: true
    root_path_2?: true
    root_path_3?: true
    root_path_4?: true
    root_path_5?: true
    root_path_6?: true
    root_path_7?: true
    root_path_8?: true
    root_path_9?: true
    root_path_10?: true
    last_scan?: true
    total_files?: true
    created_at?: true
    updated_at?: true
  }

  export type ServerConfigCountAggregateInputType = {
    id?: true
    server_url?: true
    root_path?: true
    root_path_2?: true
    root_path_3?: true
    root_path_4?: true
    root_path_5?: true
    root_path_6?: true
    root_path_7?: true
    root_path_8?: true
    root_path_9?: true
    root_path_10?: true
    last_scan?: true
    total_files?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ServerConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ServerConfig to aggregate.
     */
    where?: ServerConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServerConfigs to fetch.
     */
    orderBy?: ServerConfigOrderByWithRelationInput | ServerConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ServerConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServerConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServerConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ServerConfigs
    **/
    _count?: true | ServerConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ServerConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ServerConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ServerConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ServerConfigMaxAggregateInputType
  }

  export type GetServerConfigAggregateType<T extends ServerConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateServerConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateServerConfig[P]>
      : GetScalarType<T[P], AggregateServerConfig[P]>
  }




  export type ServerConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ServerConfigWhereInput
    orderBy?: ServerConfigOrderByWithAggregationInput | ServerConfigOrderByWithAggregationInput[]
    by: ServerConfigScalarFieldEnum[] | ServerConfigScalarFieldEnum
    having?: ServerConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ServerConfigCountAggregateInputType | true
    _avg?: ServerConfigAvgAggregateInputType
    _sum?: ServerConfigSumAggregateInputType
    _min?: ServerConfigMinAggregateInputType
    _max?: ServerConfigMaxAggregateInputType
  }

  export type ServerConfigGroupByOutputType = {
    id: string
    server_url: string
    root_path: string | null
    root_path_2: string | null
    root_path_3: string | null
    root_path_4: string | null
    root_path_5: string | null
    root_path_6: string | null
    root_path_7: string | null
    root_path_8: string | null
    root_path_9: string | null
    root_path_10: string | null
    last_scan: Date | null
    total_files: number
    created_at: Date
    updated_at: Date
    _count: ServerConfigCountAggregateOutputType | null
    _avg: ServerConfigAvgAggregateOutputType | null
    _sum: ServerConfigSumAggregateOutputType | null
    _min: ServerConfigMinAggregateOutputType | null
    _max: ServerConfigMaxAggregateOutputType | null
  }

  type GetServerConfigGroupByPayload<T extends ServerConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ServerConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ServerConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ServerConfigGroupByOutputType[P]>
            : GetScalarType<T[P], ServerConfigGroupByOutputType[P]>
        }
      >
    >


  export type ServerConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    server_url?: boolean
    root_path?: boolean
    root_path_2?: boolean
    root_path_3?: boolean
    root_path_4?: boolean
    root_path_5?: boolean
    root_path_6?: boolean
    root_path_7?: boolean
    root_path_8?: boolean
    root_path_9?: boolean
    root_path_10?: boolean
    last_scan?: boolean
    total_files?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["serverConfig"]>

  export type ServerConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    server_url?: boolean
    root_path?: boolean
    root_path_2?: boolean
    root_path_3?: boolean
    root_path_4?: boolean
    root_path_5?: boolean
    root_path_6?: boolean
    root_path_7?: boolean
    root_path_8?: boolean
    root_path_9?: boolean
    root_path_10?: boolean
    last_scan?: boolean
    total_files?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["serverConfig"]>

  export type ServerConfigSelectScalar = {
    id?: boolean
    server_url?: boolean
    root_path?: boolean
    root_path_2?: boolean
    root_path_3?: boolean
    root_path_4?: boolean
    root_path_5?: boolean
    root_path_6?: boolean
    root_path_7?: boolean
    root_path_8?: boolean
    root_path_9?: boolean
    root_path_10?: boolean
    last_scan?: boolean
    total_files?: boolean
    created_at?: boolean
    updated_at?: boolean
  }


  export type $ServerConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ServerConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      server_url: string
      root_path: string | null
      root_path_2: string | null
      root_path_3: string | null
      root_path_4: string | null
      root_path_5: string | null
      root_path_6: string | null
      root_path_7: string | null
      root_path_8: string | null
      root_path_9: string | null
      root_path_10: string | null
      last_scan: Date | null
      total_files: number
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["serverConfig"]>
    composites: {}
  }

  type ServerConfigGetPayload<S extends boolean | null | undefined | ServerConfigDefaultArgs> = $Result.GetResult<Prisma.$ServerConfigPayload, S>

  type ServerConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ServerConfigFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ServerConfigCountAggregateInputType | true
    }

  export interface ServerConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ServerConfig'], meta: { name: 'ServerConfig' } }
    /**
     * Find zero or one ServerConfig that matches the filter.
     * @param {ServerConfigFindUniqueArgs} args - Arguments to find a ServerConfig
     * @example
     * // Get one ServerConfig
     * const serverConfig = await prisma.serverConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ServerConfigFindUniqueArgs>(args: SelectSubset<T, ServerConfigFindUniqueArgs<ExtArgs>>): Prisma__ServerConfigClient<$Result.GetResult<Prisma.$ServerConfigPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ServerConfig that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ServerConfigFindUniqueOrThrowArgs} args - Arguments to find a ServerConfig
     * @example
     * // Get one ServerConfig
     * const serverConfig = await prisma.serverConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ServerConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, ServerConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ServerConfigClient<$Result.GetResult<Prisma.$ServerConfigPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ServerConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerConfigFindFirstArgs} args - Arguments to find a ServerConfig
     * @example
     * // Get one ServerConfig
     * const serverConfig = await prisma.serverConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ServerConfigFindFirstArgs>(args?: SelectSubset<T, ServerConfigFindFirstArgs<ExtArgs>>): Prisma__ServerConfigClient<$Result.GetResult<Prisma.$ServerConfigPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ServerConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerConfigFindFirstOrThrowArgs} args - Arguments to find a ServerConfig
     * @example
     * // Get one ServerConfig
     * const serverConfig = await prisma.serverConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ServerConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, ServerConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__ServerConfigClient<$Result.GetResult<Prisma.$ServerConfigPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ServerConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ServerConfigs
     * const serverConfigs = await prisma.serverConfig.findMany()
     * 
     * // Get first 10 ServerConfigs
     * const serverConfigs = await prisma.serverConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const serverConfigWithIdOnly = await prisma.serverConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ServerConfigFindManyArgs>(args?: SelectSubset<T, ServerConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServerConfigPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ServerConfig.
     * @param {ServerConfigCreateArgs} args - Arguments to create a ServerConfig.
     * @example
     * // Create one ServerConfig
     * const ServerConfig = await prisma.serverConfig.create({
     *   data: {
     *     // ... data to create a ServerConfig
     *   }
     * })
     * 
     */
    create<T extends ServerConfigCreateArgs>(args: SelectSubset<T, ServerConfigCreateArgs<ExtArgs>>): Prisma__ServerConfigClient<$Result.GetResult<Prisma.$ServerConfigPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ServerConfigs.
     * @param {ServerConfigCreateManyArgs} args - Arguments to create many ServerConfigs.
     * @example
     * // Create many ServerConfigs
     * const serverConfig = await prisma.serverConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ServerConfigCreateManyArgs>(args?: SelectSubset<T, ServerConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ServerConfigs and returns the data saved in the database.
     * @param {ServerConfigCreateManyAndReturnArgs} args - Arguments to create many ServerConfigs.
     * @example
     * // Create many ServerConfigs
     * const serverConfig = await prisma.serverConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ServerConfigs and only return the `id`
     * const serverConfigWithIdOnly = await prisma.serverConfig.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ServerConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, ServerConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ServerConfigPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ServerConfig.
     * @param {ServerConfigDeleteArgs} args - Arguments to delete one ServerConfig.
     * @example
     * // Delete one ServerConfig
     * const ServerConfig = await prisma.serverConfig.delete({
     *   where: {
     *     // ... filter to delete one ServerConfig
     *   }
     * })
     * 
     */
    delete<T extends ServerConfigDeleteArgs>(args: SelectSubset<T, ServerConfigDeleteArgs<ExtArgs>>): Prisma__ServerConfigClient<$Result.GetResult<Prisma.$ServerConfigPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ServerConfig.
     * @param {ServerConfigUpdateArgs} args - Arguments to update one ServerConfig.
     * @example
     * // Update one ServerConfig
     * const serverConfig = await prisma.serverConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ServerConfigUpdateArgs>(args: SelectSubset<T, ServerConfigUpdateArgs<ExtArgs>>): Prisma__ServerConfigClient<$Result.GetResult<Prisma.$ServerConfigPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ServerConfigs.
     * @param {ServerConfigDeleteManyArgs} args - Arguments to filter ServerConfigs to delete.
     * @example
     * // Delete a few ServerConfigs
     * const { count } = await prisma.serverConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ServerConfigDeleteManyArgs>(args?: SelectSubset<T, ServerConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ServerConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ServerConfigs
     * const serverConfig = await prisma.serverConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ServerConfigUpdateManyArgs>(args: SelectSubset<T, ServerConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ServerConfig.
     * @param {ServerConfigUpsertArgs} args - Arguments to update or create a ServerConfig.
     * @example
     * // Update or create a ServerConfig
     * const serverConfig = await prisma.serverConfig.upsert({
     *   create: {
     *     // ... data to create a ServerConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ServerConfig we want to update
     *   }
     * })
     */
    upsert<T extends ServerConfigUpsertArgs>(args: SelectSubset<T, ServerConfigUpsertArgs<ExtArgs>>): Prisma__ServerConfigClient<$Result.GetResult<Prisma.$ServerConfigPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ServerConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerConfigCountArgs} args - Arguments to filter ServerConfigs to count.
     * @example
     * // Count the number of ServerConfigs
     * const count = await prisma.serverConfig.count({
     *   where: {
     *     // ... the filter for the ServerConfigs we want to count
     *   }
     * })
    **/
    count<T extends ServerConfigCountArgs>(
      args?: Subset<T, ServerConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ServerConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ServerConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ServerConfigAggregateArgs>(args: Subset<T, ServerConfigAggregateArgs>): Prisma.PrismaPromise<GetServerConfigAggregateType<T>>

    /**
     * Group by ServerConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ServerConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ServerConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ServerConfigGroupByArgs['orderBy'] }
        : { orderBy?: ServerConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ServerConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetServerConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ServerConfig model
   */
  readonly fields: ServerConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ServerConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ServerConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ServerConfig model
   */ 
  interface ServerConfigFieldRefs {
    readonly id: FieldRef<"ServerConfig", 'String'>
    readonly server_url: FieldRef<"ServerConfig", 'String'>
    readonly root_path: FieldRef<"ServerConfig", 'String'>
    readonly root_path_2: FieldRef<"ServerConfig", 'String'>
    readonly root_path_3: FieldRef<"ServerConfig", 'String'>
    readonly root_path_4: FieldRef<"ServerConfig", 'String'>
    readonly root_path_5: FieldRef<"ServerConfig", 'String'>
    readonly root_path_6: FieldRef<"ServerConfig", 'String'>
    readonly root_path_7: FieldRef<"ServerConfig", 'String'>
    readonly root_path_8: FieldRef<"ServerConfig", 'String'>
    readonly root_path_9: FieldRef<"ServerConfig", 'String'>
    readonly root_path_10: FieldRef<"ServerConfig", 'String'>
    readonly last_scan: FieldRef<"ServerConfig", 'DateTime'>
    readonly total_files: FieldRef<"ServerConfig", 'Int'>
    readonly created_at: FieldRef<"ServerConfig", 'DateTime'>
    readonly updated_at: FieldRef<"ServerConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ServerConfig findUnique
   */
  export type ServerConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServerConfig
     */
    select?: ServerConfigSelect<ExtArgs> | null
    /**
     * Filter, which ServerConfig to fetch.
     */
    where: ServerConfigWhereUniqueInput
  }

  /**
   * ServerConfig findUniqueOrThrow
   */
  export type ServerConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServerConfig
     */
    select?: ServerConfigSelect<ExtArgs> | null
    /**
     * Filter, which ServerConfig to fetch.
     */
    where: ServerConfigWhereUniqueInput
  }

  /**
   * ServerConfig findFirst
   */
  export type ServerConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServerConfig
     */
    select?: ServerConfigSelect<ExtArgs> | null
    /**
     * Filter, which ServerConfig to fetch.
     */
    where?: ServerConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServerConfigs to fetch.
     */
    orderBy?: ServerConfigOrderByWithRelationInput | ServerConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ServerConfigs.
     */
    cursor?: ServerConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServerConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServerConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ServerConfigs.
     */
    distinct?: ServerConfigScalarFieldEnum | ServerConfigScalarFieldEnum[]
  }

  /**
   * ServerConfig findFirstOrThrow
   */
  export type ServerConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServerConfig
     */
    select?: ServerConfigSelect<ExtArgs> | null
    /**
     * Filter, which ServerConfig to fetch.
     */
    where?: ServerConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServerConfigs to fetch.
     */
    orderBy?: ServerConfigOrderByWithRelationInput | ServerConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ServerConfigs.
     */
    cursor?: ServerConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServerConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServerConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ServerConfigs.
     */
    distinct?: ServerConfigScalarFieldEnum | ServerConfigScalarFieldEnum[]
  }

  /**
   * ServerConfig findMany
   */
  export type ServerConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServerConfig
     */
    select?: ServerConfigSelect<ExtArgs> | null
    /**
     * Filter, which ServerConfigs to fetch.
     */
    where?: ServerConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ServerConfigs to fetch.
     */
    orderBy?: ServerConfigOrderByWithRelationInput | ServerConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ServerConfigs.
     */
    cursor?: ServerConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ServerConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ServerConfigs.
     */
    skip?: number
    distinct?: ServerConfigScalarFieldEnum | ServerConfigScalarFieldEnum[]
  }

  /**
   * ServerConfig create
   */
  export type ServerConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServerConfig
     */
    select?: ServerConfigSelect<ExtArgs> | null
    /**
     * The data needed to create a ServerConfig.
     */
    data: XOR<ServerConfigCreateInput, ServerConfigUncheckedCreateInput>
  }

  /**
   * ServerConfig createMany
   */
  export type ServerConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ServerConfigs.
     */
    data: ServerConfigCreateManyInput | ServerConfigCreateManyInput[]
  }

  /**
   * ServerConfig createManyAndReturn
   */
  export type ServerConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServerConfig
     */
    select?: ServerConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ServerConfigs.
     */
    data: ServerConfigCreateManyInput | ServerConfigCreateManyInput[]
  }

  /**
   * ServerConfig update
   */
  export type ServerConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServerConfig
     */
    select?: ServerConfigSelect<ExtArgs> | null
    /**
     * The data needed to update a ServerConfig.
     */
    data: XOR<ServerConfigUpdateInput, ServerConfigUncheckedUpdateInput>
    /**
     * Choose, which ServerConfig to update.
     */
    where: ServerConfigWhereUniqueInput
  }

  /**
   * ServerConfig updateMany
   */
  export type ServerConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ServerConfigs.
     */
    data: XOR<ServerConfigUpdateManyMutationInput, ServerConfigUncheckedUpdateManyInput>
    /**
     * Filter which ServerConfigs to update
     */
    where?: ServerConfigWhereInput
  }

  /**
   * ServerConfig upsert
   */
  export type ServerConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServerConfig
     */
    select?: ServerConfigSelect<ExtArgs> | null
    /**
     * The filter to search for the ServerConfig to update in case it exists.
     */
    where: ServerConfigWhereUniqueInput
    /**
     * In case the ServerConfig found by the `where` argument doesn't exist, create a new ServerConfig with this data.
     */
    create: XOR<ServerConfigCreateInput, ServerConfigUncheckedCreateInput>
    /**
     * In case the ServerConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ServerConfigUpdateInput, ServerConfigUncheckedUpdateInput>
  }

  /**
   * ServerConfig delete
   */
  export type ServerConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServerConfig
     */
    select?: ServerConfigSelect<ExtArgs> | null
    /**
     * Filter which ServerConfig to delete.
     */
    where: ServerConfigWhereUniqueInput
  }

  /**
   * ServerConfig deleteMany
   */
  export type ServerConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ServerConfigs to delete
     */
    where?: ServerConfigWhereInput
  }

  /**
   * ServerConfig without action
   */
  export type ServerConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ServerConfig
     */
    select?: ServerConfigSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const FileRecordScalarFieldEnum: {
    id: 'id',
    file_name: 'file_name',
    file_path: 'file_path',
    file_size: 'file_size',
    file_type: 'file_type',
    owner_user: 'owner_user',
    last_modified: 'last_modified',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type FileRecordScalarFieldEnum = (typeof FileRecordScalarFieldEnum)[keyof typeof FileRecordScalarFieldEnum]


  export const ServerConfigScalarFieldEnum: {
    id: 'id',
    server_url: 'server_url',
    root_path: 'root_path',
    root_path_2: 'root_path_2',
    root_path_3: 'root_path_3',
    root_path_4: 'root_path_4',
    root_path_5: 'root_path_5',
    root_path_6: 'root_path_6',
    root_path_7: 'root_path_7',
    root_path_8: 'root_path_8',
    root_path_9: 'root_path_9',
    root_path_10: 'root_path_10',
    last_scan: 'last_scan',
    total_files: 'total_files',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ServerConfigScalarFieldEnum = (typeof ServerConfigScalarFieldEnum)[keyof typeof ServerConfigScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type FileRecordWhereInput = {
    AND?: FileRecordWhereInput | FileRecordWhereInput[]
    OR?: FileRecordWhereInput[]
    NOT?: FileRecordWhereInput | FileRecordWhereInput[]
    id?: StringFilter<"FileRecord"> | string
    file_name?: StringFilter<"FileRecord"> | string
    file_path?: StringFilter<"FileRecord"> | string
    file_size?: IntFilter<"FileRecord"> | number
    file_type?: StringFilter<"FileRecord"> | string
    owner_user?: StringNullableFilter<"FileRecord"> | string | null
    last_modified?: DateTimeFilter<"FileRecord"> | Date | string
    created_at?: DateTimeFilter<"FileRecord"> | Date | string
    updated_at?: DateTimeFilter<"FileRecord"> | Date | string
  }

  export type FileRecordOrderByWithRelationInput = {
    id?: SortOrder
    file_name?: SortOrder
    file_path?: SortOrder
    file_size?: SortOrder
    file_type?: SortOrder
    owner_user?: SortOrderInput | SortOrder
    last_modified?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type FileRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    file_path?: string
    AND?: FileRecordWhereInput | FileRecordWhereInput[]
    OR?: FileRecordWhereInput[]
    NOT?: FileRecordWhereInput | FileRecordWhereInput[]
    file_name?: StringFilter<"FileRecord"> | string
    file_size?: IntFilter<"FileRecord"> | number
    file_type?: StringFilter<"FileRecord"> | string
    owner_user?: StringNullableFilter<"FileRecord"> | string | null
    last_modified?: DateTimeFilter<"FileRecord"> | Date | string
    created_at?: DateTimeFilter<"FileRecord"> | Date | string
    updated_at?: DateTimeFilter<"FileRecord"> | Date | string
  }, "id" | "file_path">

  export type FileRecordOrderByWithAggregationInput = {
    id?: SortOrder
    file_name?: SortOrder
    file_path?: SortOrder
    file_size?: SortOrder
    file_type?: SortOrder
    owner_user?: SortOrderInput | SortOrder
    last_modified?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: FileRecordCountOrderByAggregateInput
    _avg?: FileRecordAvgOrderByAggregateInput
    _max?: FileRecordMaxOrderByAggregateInput
    _min?: FileRecordMinOrderByAggregateInput
    _sum?: FileRecordSumOrderByAggregateInput
  }

  export type FileRecordScalarWhereWithAggregatesInput = {
    AND?: FileRecordScalarWhereWithAggregatesInput | FileRecordScalarWhereWithAggregatesInput[]
    OR?: FileRecordScalarWhereWithAggregatesInput[]
    NOT?: FileRecordScalarWhereWithAggregatesInput | FileRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FileRecord"> | string
    file_name?: StringWithAggregatesFilter<"FileRecord"> | string
    file_path?: StringWithAggregatesFilter<"FileRecord"> | string
    file_size?: IntWithAggregatesFilter<"FileRecord"> | number
    file_type?: StringWithAggregatesFilter<"FileRecord"> | string
    owner_user?: StringNullableWithAggregatesFilter<"FileRecord"> | string | null
    last_modified?: DateTimeWithAggregatesFilter<"FileRecord"> | Date | string
    created_at?: DateTimeWithAggregatesFilter<"FileRecord"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"FileRecord"> | Date | string
  }

  export type ServerConfigWhereInput = {
    AND?: ServerConfigWhereInput | ServerConfigWhereInput[]
    OR?: ServerConfigWhereInput[]
    NOT?: ServerConfigWhereInput | ServerConfigWhereInput[]
    id?: StringFilter<"ServerConfig"> | string
    server_url?: StringFilter<"ServerConfig"> | string
    root_path?: StringNullableFilter<"ServerConfig"> | string | null
    root_path_2?: StringNullableFilter<"ServerConfig"> | string | null
    root_path_3?: StringNullableFilter<"ServerConfig"> | string | null
    root_path_4?: StringNullableFilter<"ServerConfig"> | string | null
    root_path_5?: StringNullableFilter<"ServerConfig"> | string | null
    root_path_6?: StringNullableFilter<"ServerConfig"> | string | null
    root_path_7?: StringNullableFilter<"ServerConfig"> | string | null
    root_path_8?: StringNullableFilter<"ServerConfig"> | string | null
    root_path_9?: StringNullableFilter<"ServerConfig"> | string | null
    root_path_10?: StringNullableFilter<"ServerConfig"> | string | null
    last_scan?: DateTimeNullableFilter<"ServerConfig"> | Date | string | null
    total_files?: IntFilter<"ServerConfig"> | number
    created_at?: DateTimeFilter<"ServerConfig"> | Date | string
    updated_at?: DateTimeFilter<"ServerConfig"> | Date | string
  }

  export type ServerConfigOrderByWithRelationInput = {
    id?: SortOrder
    server_url?: SortOrder
    root_path?: SortOrderInput | SortOrder
    root_path_2?: SortOrderInput | SortOrder
    root_path_3?: SortOrderInput | SortOrder
    root_path_4?: SortOrderInput | SortOrder
    root_path_5?: SortOrderInput | SortOrder
    root_path_6?: SortOrderInput | SortOrder
    root_path_7?: SortOrderInput | SortOrder
    root_path_8?: SortOrderInput | SortOrder
    root_path_9?: SortOrderInput | SortOrder
    root_path_10?: SortOrderInput | SortOrder
    last_scan?: SortOrderInput | SortOrder
    total_files?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ServerConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ServerConfigWhereInput | ServerConfigWhereInput[]
    OR?: ServerConfigWhereInput[]
    NOT?: ServerConfigWhereInput | ServerConfigWhereInput[]
    server_url?: StringFilter<"ServerConfig"> | string
    root_path?: StringNullableFilter<"ServerConfig"> | string | null
    root_path_2?: StringNullableFilter<"ServerConfig"> | string | null
    root_path_3?: StringNullableFilter<"ServerConfig"> | string | null
    root_path_4?: StringNullableFilter<"ServerConfig"> | string | null
    root_path_5?: StringNullableFilter<"ServerConfig"> | string | null
    root_path_6?: StringNullableFilter<"ServerConfig"> | string | null
    root_path_7?: StringNullableFilter<"ServerConfig"> | string | null
    root_path_8?: StringNullableFilter<"ServerConfig"> | string | null
    root_path_9?: StringNullableFilter<"ServerConfig"> | string | null
    root_path_10?: StringNullableFilter<"ServerConfig"> | string | null
    last_scan?: DateTimeNullableFilter<"ServerConfig"> | Date | string | null
    total_files?: IntFilter<"ServerConfig"> | number
    created_at?: DateTimeFilter<"ServerConfig"> | Date | string
    updated_at?: DateTimeFilter<"ServerConfig"> | Date | string
  }, "id">

  export type ServerConfigOrderByWithAggregationInput = {
    id?: SortOrder
    server_url?: SortOrder
    root_path?: SortOrderInput | SortOrder
    root_path_2?: SortOrderInput | SortOrder
    root_path_3?: SortOrderInput | SortOrder
    root_path_4?: SortOrderInput | SortOrder
    root_path_5?: SortOrderInput | SortOrder
    root_path_6?: SortOrderInput | SortOrder
    root_path_7?: SortOrderInput | SortOrder
    root_path_8?: SortOrderInput | SortOrder
    root_path_9?: SortOrderInput | SortOrder
    root_path_10?: SortOrderInput | SortOrder
    last_scan?: SortOrderInput | SortOrder
    total_files?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ServerConfigCountOrderByAggregateInput
    _avg?: ServerConfigAvgOrderByAggregateInput
    _max?: ServerConfigMaxOrderByAggregateInput
    _min?: ServerConfigMinOrderByAggregateInput
    _sum?: ServerConfigSumOrderByAggregateInput
  }

  export type ServerConfigScalarWhereWithAggregatesInput = {
    AND?: ServerConfigScalarWhereWithAggregatesInput | ServerConfigScalarWhereWithAggregatesInput[]
    OR?: ServerConfigScalarWhereWithAggregatesInput[]
    NOT?: ServerConfigScalarWhereWithAggregatesInput | ServerConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ServerConfig"> | string
    server_url?: StringWithAggregatesFilter<"ServerConfig"> | string
    root_path?: StringNullableWithAggregatesFilter<"ServerConfig"> | string | null
    root_path_2?: StringNullableWithAggregatesFilter<"ServerConfig"> | string | null
    root_path_3?: StringNullableWithAggregatesFilter<"ServerConfig"> | string | null
    root_path_4?: StringNullableWithAggregatesFilter<"ServerConfig"> | string | null
    root_path_5?: StringNullableWithAggregatesFilter<"ServerConfig"> | string | null
    root_path_6?: StringNullableWithAggregatesFilter<"ServerConfig"> | string | null
    root_path_7?: StringNullableWithAggregatesFilter<"ServerConfig"> | string | null
    root_path_8?: StringNullableWithAggregatesFilter<"ServerConfig"> | string | null
    root_path_9?: StringNullableWithAggregatesFilter<"ServerConfig"> | string | null
    root_path_10?: StringNullableWithAggregatesFilter<"ServerConfig"> | string | null
    last_scan?: DateTimeNullableWithAggregatesFilter<"ServerConfig"> | Date | string | null
    total_files?: IntWithAggregatesFilter<"ServerConfig"> | number
    created_at?: DateTimeWithAggregatesFilter<"ServerConfig"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"ServerConfig"> | Date | string
  }

  export type FileRecordCreateInput = {
    id?: string
    file_name: string
    file_path: string
    file_size: number
    file_type: string
    owner_user?: string | null
    last_modified: Date | string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type FileRecordUncheckedCreateInput = {
    id?: string
    file_name: string
    file_path: string
    file_size: number
    file_type: string
    owner_user?: string | null
    last_modified: Date | string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type FileRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_name?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    file_size?: IntFieldUpdateOperationsInput | number
    file_type?: StringFieldUpdateOperationsInput | string
    owner_user?: NullableStringFieldUpdateOperationsInput | string | null
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_name?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    file_size?: IntFieldUpdateOperationsInput | number
    file_type?: StringFieldUpdateOperationsInput | string
    owner_user?: NullableStringFieldUpdateOperationsInput | string | null
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileRecordCreateManyInput = {
    id?: string
    file_name: string
    file_path: string
    file_size: number
    file_type: string
    owner_user?: string | null
    last_modified: Date | string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type FileRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_name?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    file_size?: IntFieldUpdateOperationsInput | number
    file_type?: StringFieldUpdateOperationsInput | string
    owner_user?: NullableStringFieldUpdateOperationsInput | string | null
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FileRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    file_name?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    file_size?: IntFieldUpdateOperationsInput | number
    file_type?: StringFieldUpdateOperationsInput | string
    owner_user?: NullableStringFieldUpdateOperationsInput | string | null
    last_modified?: DateTimeFieldUpdateOperationsInput | Date | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServerConfigCreateInput = {
    id?: string
    server_url: string
    root_path?: string | null
    root_path_2?: string | null
    root_path_3?: string | null
    root_path_4?: string | null
    root_path_5?: string | null
    root_path_6?: string | null
    root_path_7?: string | null
    root_path_8?: string | null
    root_path_9?: string | null
    root_path_10?: string | null
    last_scan?: Date | string | null
    total_files?: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ServerConfigUncheckedCreateInput = {
    id?: string
    server_url: string
    root_path?: string | null
    root_path_2?: string | null
    root_path_3?: string | null
    root_path_4?: string | null
    root_path_5?: string | null
    root_path_6?: string | null
    root_path_7?: string | null
    root_path_8?: string | null
    root_path_9?: string | null
    root_path_10?: string | null
    last_scan?: Date | string | null
    total_files?: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ServerConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    server_url?: StringFieldUpdateOperationsInput | string
    root_path?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_2?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_3?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_4?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_5?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_6?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_7?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_8?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_9?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_10?: NullableStringFieldUpdateOperationsInput | string | null
    last_scan?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_files?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServerConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    server_url?: StringFieldUpdateOperationsInput | string
    root_path?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_2?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_3?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_4?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_5?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_6?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_7?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_8?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_9?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_10?: NullableStringFieldUpdateOperationsInput | string | null
    last_scan?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_files?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServerConfigCreateManyInput = {
    id?: string
    server_url: string
    root_path?: string | null
    root_path_2?: string | null
    root_path_3?: string | null
    root_path_4?: string | null
    root_path_5?: string | null
    root_path_6?: string | null
    root_path_7?: string | null
    root_path_8?: string | null
    root_path_9?: string | null
    root_path_10?: string | null
    last_scan?: Date | string | null
    total_files?: number
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ServerConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    server_url?: StringFieldUpdateOperationsInput | string
    root_path?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_2?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_3?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_4?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_5?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_6?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_7?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_8?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_9?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_10?: NullableStringFieldUpdateOperationsInput | string | null
    last_scan?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_files?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ServerConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    server_url?: StringFieldUpdateOperationsInput | string
    root_path?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_2?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_3?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_4?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_5?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_6?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_7?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_8?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_9?: NullableStringFieldUpdateOperationsInput | string | null
    root_path_10?: NullableStringFieldUpdateOperationsInput | string | null
    last_scan?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    total_files?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type FileRecordCountOrderByAggregateInput = {
    id?: SortOrder
    file_name?: SortOrder
    file_path?: SortOrder
    file_size?: SortOrder
    file_type?: SortOrder
    owner_user?: SortOrder
    last_modified?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type FileRecordAvgOrderByAggregateInput = {
    file_size?: SortOrder
  }

  export type FileRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    file_name?: SortOrder
    file_path?: SortOrder
    file_size?: SortOrder
    file_type?: SortOrder
    owner_user?: SortOrder
    last_modified?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type FileRecordMinOrderByAggregateInput = {
    id?: SortOrder
    file_name?: SortOrder
    file_path?: SortOrder
    file_size?: SortOrder
    file_type?: SortOrder
    owner_user?: SortOrder
    last_modified?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type FileRecordSumOrderByAggregateInput = {
    file_size?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ServerConfigCountOrderByAggregateInput = {
    id?: SortOrder
    server_url?: SortOrder
    root_path?: SortOrder
    root_path_2?: SortOrder
    root_path_3?: SortOrder
    root_path_4?: SortOrder
    root_path_5?: SortOrder
    root_path_6?: SortOrder
    root_path_7?: SortOrder
    root_path_8?: SortOrder
    root_path_9?: SortOrder
    root_path_10?: SortOrder
    last_scan?: SortOrder
    total_files?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ServerConfigAvgOrderByAggregateInput = {
    total_files?: SortOrder
  }

  export type ServerConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    server_url?: SortOrder
    root_path?: SortOrder
    root_path_2?: SortOrder
    root_path_3?: SortOrder
    root_path_4?: SortOrder
    root_path_5?: SortOrder
    root_path_6?: SortOrder
    root_path_7?: SortOrder
    root_path_8?: SortOrder
    root_path_9?: SortOrder
    root_path_10?: SortOrder
    last_scan?: SortOrder
    total_files?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ServerConfigMinOrderByAggregateInput = {
    id?: SortOrder
    server_url?: SortOrder
    root_path?: SortOrder
    root_path_2?: SortOrder
    root_path_3?: SortOrder
    root_path_4?: SortOrder
    root_path_5?: SortOrder
    root_path_6?: SortOrder
    root_path_7?: SortOrder
    root_path_8?: SortOrder
    root_path_9?: SortOrder
    root_path_10?: SortOrder
    last_scan?: SortOrder
    total_files?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ServerConfigSumOrderByAggregateInput = {
    total_files?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use FileRecordDefaultArgs instead
     */
    export type FileRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FileRecordDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ServerConfigDefaultArgs instead
     */
    export type ServerConfigArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ServerConfigDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}