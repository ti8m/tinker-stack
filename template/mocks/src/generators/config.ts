export type DatasetConfig = {
  preset: string;
};

export const datasetConfigs = {
  small: {
    preset: 'small',
  },
  medium: {
    preset: 'medium',
  },
  full: {
    preset: 'full',
  },
} satisfies Record<string, DatasetConfig>;

export type DatasetPreset = keyof typeof datasetConfigs;
