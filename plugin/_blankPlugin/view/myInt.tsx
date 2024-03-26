import { CellComponent, FieldController, FieldControllerConfig, FieldProps } from "@keystone-6/core/types";
import React from "react";
import { FieldContainer, FieldLabel, TextInput } from '@keystone-ui/fields';
import { CellLink, CellContainer } from '@keystone-6/core/admin-ui/components';
import { CardValueComponent } from '@keystone-6/core/types';

/**
 * The controller export defines the functional parts of the frontend of a field.
 * @param config
 * @returns
 */

export const controller = (config: FieldControllerConfig): FieldController<string, string> => {
  return {
    path: config.path,
    label: config.label,
    graphqlSelection: config.path,
    description: '',
    defaultValue: '',
    deserialize: data => {
      const value = data[config.path];
      return typeof value === 'number' ? value + '' : '';
    },
    serialize: value => ({ [config.path]: value === '' ? null : parseInt(value, 10) }),
  };
};

/**
 * Field
 * The `Field` export is a React component which is used in the item view and the create modal that allows users to view and edit the value of the field.
 * @param param0
 * @returns
 */

export const Field = ({ field, value, onChange, autoFocus }: FieldProps<typeof controller>) => (
  <FieldContainer>
    <FieldLabel htmlFor={field.path}>{field.label}</FieldLabel>
    {onChange ? (
      <TextInput
        id={field.path}
        autoFocus={autoFocus}
        type="number"
        onChange={event => {
          onChange(event.target.value.replace(/[^\d-]/g, ''));
        }}
        value={value}
      />
    ) : (
      value
    )}
  </FieldContainer>
);
/**
 * The Cell export is a React component which is shown in the table on the list view. Note it does not allow modifying the value.
 * @param param0
 * @returns
 */
export const Cell: CellComponent = ({ item, field, linkTo }) => {
  let value = item[field.path] + '';
  return linkTo ? <CellLink {...linkTo}>{value}</CellLink> : <CellContainer>{value}</CellContainer>;
};
Cell.supportsLinkTo = true;

/**
 * The CardValue export is a React component which is shown on the item view in relationship fields with displayMode: 'cards' when the related item is not being edited. Note it does not allow modifying the value.
 * @param param0
 * @returns
 */

export const CardValue: CardValueComponent = ({ item, field }) => {
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      {item[field.path]}
    </FieldContainer>
  );
};