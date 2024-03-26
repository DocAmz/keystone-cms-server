import { graphql } from "@graphql-ts/schema";
import { BaseListTypeInfo, CommonFieldConfig, fieldType, FieldTypeFunc, KeystoneConfig, orderDirectionEnum } from "@keystone-6/core/types";

// Custom Field Type

export type MyPluginFieldConfig<ListTypeInfo extends BaseListTypeInfo> =
  CommonFieldConfig<ListTypeInfo> & {
    isIndexed?: boolean | 'unique';
  }

  export const myInt =
  <ListTypeInfo extends BaseListTypeInfo>({
    isIndexed,
    ...config
  }: MyPluginFieldConfig<ListTypeInfo> = {}): FieldTypeFunc<ListTypeInfo> =>
  meta =>
    fieldType({
      kind: 'scalar',
      mode: 'optional',
      scalar: 'Int',
      index: isIndexed === true ? 'index' : isIndexed || undefined,
    })({
      ...config,
      input: {
        create: { arg: graphql.arg({ type: graphql.Int }) },
        update: { arg: graphql.arg({ type: graphql.Int }) },
        orderBy: { arg: graphql.arg({ type: orderDirectionEnum }) },
      },
      output: graphql.field({ type: graphql.Int }),
      views: './view/myInt',
    });
