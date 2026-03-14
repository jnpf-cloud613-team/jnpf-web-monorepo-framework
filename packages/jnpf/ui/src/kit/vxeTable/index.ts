import './src/style/index.scss';

export type { FormProps, FormSchema } from '../basicForm/src/types/form';
export { default as BasicVxeTable } from './src/BasicVxeTable.vue';
export { default as TableAction } from './src/components/TableAction.vue';
export { useVxeTable } from './src/hooks/useTable';
export * from './src/types/pagination';
export * from './src/types/table';
export * from './src/types/tableAction';
