//

export { }

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { app, type, feature } from '@josemf/core-types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import relational from '@josemf/core-relational-prisma';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import admin from '@josemf/core-admin-keystonejs';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import storage from '@josemf/core-storage';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import restful from '@josemf/core-restful-openapi';

import loadModels from './models';

app.base(relational, admin, storage, restful);

feature("admin").config({
    title: "ThreeSoundRevolution",
    auth: {
        model: "#User"
    }    
});

feature("relational").config({
    provider: "postgresql",
    database: {
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME
    },
    id: {
        algo: "cuid"
    }
});

feature("storage").config({
    provider: "s3",
    s3: {
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

        bucket: process.env.AWS_S3_BUCKET,
        basePath: "sounds",

        baseUrl: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/`
    }
});

loadModels();

app.start();
