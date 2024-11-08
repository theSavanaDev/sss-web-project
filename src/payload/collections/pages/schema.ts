import { slugField } from "@/payload/fields/slug/schema";

import { authenticated } from "@/payload/access/authenticated";
import { authenticatedOrPublished } from "@/payload/access/authenticated-or-published";

import { populatePublishedOn } from "@/payload/collections/pages/hooks/populate-published-on";
import { revalidatePage } from "@/payload/collections/pages/hooks/revalidate-page";

import { Hero } from "@/payload/blocks/hero/schema";

import type { CollectionConfig } from "payload";

export const Pages: CollectionConfig = {
	slug: "pages",
	labels: {
		singular: "Page",
		plural: "Pages",
	},
	access: {
		create: authenticated,
		delete: authenticated,
		read: authenticatedOrPublished,
		update: authenticated,
	},
	admin: {
		defaultColumns: ["title", "slug", "createdAt", "updatedAt"],
		useAsTitle: "title",
	},
	fields: [
		{
			name: "title",
			label: "Page Title",
			type: "text",
			required: true,
		},
		...slugField(),
		{
			name: "publishedOn",
			label: "Published On",
			type: "date",
			admin: {
				date: {
					pickerAppearance: "dayOnly",
					displayFormat: "do MMM yyyy",
				},
				position: "sidebar",
			},
		},
		{
			type: "tabs",
			tabs: [
				{
					label: "Content",
					fields: [
						{
							name: "layout",
							label: "Layout",
							labels: {
								singular: "Layout Block",
								plural: "Layout Blocks",
							},
							type: "blocks",
							blocks: [Hero],
						},
					],
				},
				{
					name: "meta",
					label: "SEO",
					fields: [],
				},
			],
		},
	],
	hooks: {
		afterChange: [revalidatePage],
		beforeChange: [populatePublishedOn],
	},
	versions: {
		drafts: {
			autosave: {
				interval: 100,
			},
		},
		maxPerDoc: 50,
	},
};
