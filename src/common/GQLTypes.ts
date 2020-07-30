import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: Promise<{ filename: string, mimetype: string, encoding: string, createReadStream: () => NodeJS.ReadableStream }>;
};


export type Query = {
  __typename?: 'Query';
  users: Array<UserInfo>;
  roles: Array<Role>;
};


export type QueryUsersArgs = {
  userName?: Maybe<Scalars['String']>;
  telephone?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  login: UserToken;
  revokeToken: Scalars['Boolean'];
  addUser: Scalars['Boolean'];
  editUser: Scalars['Boolean'];
  removeUser: Scalars['Boolean'];
};


export type MutationLoginArgs = {
  id: Scalars['String'];
  password: Scalars['String'];
};


export type MutationAddUserArgs = {
  user: InputUserInfo;
};


export type MutationEditUserArgs = {
  userId: Scalars['Int'];
  user: InputEditUserInfo;
};


export type MutationRemoveUserArgs = {
  userIds: Array<Scalars['Int']>;
};

export type UserToken = {
  __typename?: 'UserToken';
  name: Scalars['String'];
  role: Role;
  token: Scalars['String'];
};

export type UserInfo = {
  __typename?: 'UserInfo';
  userId: Scalars['Int'];
  loginId: Scalars['String'];
  userName: Scalars['String'];
  telephone: Scalars['String'];
  role: Role;
};

export type Role = {
  __typename?: 'Role';
  roleId: Scalars['Int'];
  roleName: Scalars['String'];
  isAdmin: Scalars['Boolean'];
};

export type InputUserInfo = {
  loginId: Scalars['String'];
  userName: Scalars['String'];
  telephone: Scalars['String'];
  password: Scalars['String'];
  roleId: Scalars['Int'];
};

export type InputEditUserInfo = {
  loginId: Scalars['String'];
  userName: Scalars['String'];
  telephone: Scalars['String'];
  roleId: Scalars['Int'];
};

export type AddUserMutationVariables = Exact<{
  user: InputUserInfo;
}>;


export type AddUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'addUser'>
);

export type EditUserMutationVariables = Exact<{
  userId: Scalars['Int'];
  user: InputEditUserInfo;
}>;


export type EditUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'editUser'>
);

export type LoginMutationVariables = Exact<{
  id: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserToken' }
    & Pick<UserToken, 'name' | 'token'>
    & { role: (
      { __typename?: 'Role' }
      & Pick<Role, 'roleId' | 'roleName' | 'isAdmin'>
    ) }
  ) }
);

export type RemoveUserMutationVariables = Exact<{
  userIds: Array<Scalars['Int']>;
}>;


export type RemoveUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'removeUser'>
);

export type RevokeTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RevokeTokenMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'revokeToken'>
);

export type RolesQueryVariables = Exact<{ [key: string]: never; }>;


export type RolesQuery = (
  { __typename?: 'Query' }
  & { roles: Array<(
    { __typename?: 'Role' }
    & Pick<Role, 'roleId' | 'roleName'>
  )> }
);

export type UsersQueryVariables = Exact<{
  userName?: Maybe<Scalars['String']>;
  telephone?: Maybe<Scalars['String']>;
}>;


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: Array<(
    { __typename?: 'UserInfo' }
    & Pick<UserInfo, 'userId' | 'loginId' | 'userName' | 'telephone'>
    & { role: (
      { __typename?: 'Role' }
      & Pick<Role, 'roleId' | 'roleName'>
    ) }
  )> }
);



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  UserToken: ResolverTypeWrapper<UserToken>;
  UserInfo: ResolverTypeWrapper<UserInfo>;
  Role: ResolverTypeWrapper<Role>;
  InputUserInfo: InputUserInfo;
  InputEditUserInfo: InputEditUserInfo;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Upload: Scalars['Upload'];
  Query: {};
  String: Scalars['String'];
  Mutation: {};
  Boolean: Scalars['Boolean'];
  Int: Scalars['Int'];
  UserToken: UserToken;
  UserInfo: UserInfo;
  Role: Role;
  InputUserInfo: InputUserInfo;
  InputEditUserInfo: InputEditUserInfo;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  users?: Resolver<Array<ResolversTypes['UserInfo']>, ParentType, ContextType, RequireFields<QueryUsersArgs, never>>;
  roles?: Resolver<Array<ResolversTypes['Role']>, ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  login?: Resolver<ResolversTypes['UserToken'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'id' | 'password'>>;
  revokeToken?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  addUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationAddUserArgs, 'user'>>;
  editUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationEditUserArgs, 'userId' | 'user'>>;
  removeUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRemoveUserArgs, 'userIds'>>;
};

export type UserTokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserToken'] = ResolversParentTypes['UserToken']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type UserInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserInfo'] = ResolversParentTypes['UserInfo']> = {
  userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  loginId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  telephone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['Role'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type RoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Role'] = ResolversParentTypes['Role']> = {
  roleId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  roleName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isAdmin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type Resolvers<ContextType = any> = {
  Upload?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  UserToken?: UserTokenResolvers<ContextType>;
  UserInfo?: UserInfoResolvers<ContextType>;
  Role?: RoleResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
