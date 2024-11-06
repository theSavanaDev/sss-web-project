import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { resendAdapter } from "@payloadcms/email-resend";
import { BoldFeature, ItalicFeature, LinkFeature, UnderlineFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { uploadthingStorage } from "@payloadcms/storage-uploadthing";
import { buildConfig } from "payload";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { Media } from "@/payload/collections/media/schema";
import { Users } from "@/payload/collections/users/schema";

import { Footer } from "@/payload/blocks/globals/footer/schema";
import { Header } from "@/payload/blocks/globals/header/schema";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const databaseURI = process.env.NODE_ENV === "development" ? process.env.DATABASE_URI_DEV! : process.env.DATABASE_URI_PRD!;
const payloadSecret = process.env.PAYLOAD_SECRET!;
const resendAPIKey = process.env.RESEND_API_KEY!;
const uploadthingSecret = process.env.UPLOADTHING_SECRET!;

export default buildConfig({
	admin: {
		importMap: {
			baseDir: path.resolve(dirname),
		},
		user: Users.slug,
	},
	collections: [Media, Users],
	db: mongooseAdapter({ url: databaseURI }),
	editor: lexicalEditor({
		features: () => {
			return [
				UnderlineFeature(),
				BoldFeature(),
				ItalicFeature(),
				LinkFeature({
					enabledCollections: [],
					fields: ({ defaultFields }) => {
						const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
							if ("name" in field && field.name === "url") return false;
							return true;
						});

						return [
							...defaultFieldsWithoutUrl,
							{
								name: "url",
								type: "text",
								admin: {
									condition: ({ linkType }) => linkType !== "internal",
								},
								label: ({ t }) => t("fields:enterURL"),
								required: true,
							},
						];
					},
				}),
			];
		},
	}),
	email: resendAdapter({
		defaultFromAddress: "hello@s3.co.ke",
		defaultFromName: "Mailer @ S3",
		apiKey: resendAPIKey,
	}),
	globals: [Header, Footer],
	plugins: [
		uploadthingStorage({
			collections: {
				[Media.slug]: true,
			},
			options: {
				apiKey: uploadthingSecret,
				acl: "public-read",
			},
		}),
	],
	secret: payloadSecret,
	sharp,
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
});
