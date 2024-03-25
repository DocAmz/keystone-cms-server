import { StorageConfig } from "@keystone-6/core/types";
const {
  ASSET_BASE_URL,
} = process.env;


export const storageConfig: Record<string, StorageConfig> = {
  my_images: {
    kind: 'local',
    type: 'image',
    generateUrl: path => `http://localhost:3000/images${path}`,
    serverRoute: {
      path: '/images',
    },
    storagePath: 'public/images',
  },
  my_files: {
    kind: 'local',
    type: 'file',
    generateUrl: path => `http://localhost:3000/files${path}`,
    serverRoute: {
      path: '/files',
    },
    storagePath: 'public/files',
  },
};
