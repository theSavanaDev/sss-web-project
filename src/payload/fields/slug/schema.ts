import { formatSlugField } from "@/payload/fields/slug/hooks/format-slug";

import type { CheckboxField, TextField } from "payload";

type Overrides = {
	slugOverrides?: Partial<TextField>;
	checkboxOverrides?: Partial<CheckboxField>;
};

type Slug = (fieldToUse?: string, overrides?: Overrides) => [TextField, CheckboxField];

export const slug: Slug = (fieldToUse = "title", overrides = {}) => {
	const { slugOverrides, checkboxOverrides } = overrides;

	const checkBoxField: CheckboxField = {
		name: "slugLock",
		type: "checkbox",
		defaultValue: true,
		admin: {
			hidden: true,
			position: "sidebar",
		},
		...checkboxOverrides,
	};

	// expect ts error here because of typescript mismatching Partial<TextField> with TextField
	// @ts-expect-error
	const slug: TextField = {
		name: "slug",
		type: "text",
		index: true,
		label: "Slug",
		required: true,
		...(slugOverrides || {}),
		hooks: {
			// kept this in for hook or API based updates
			beforeValidate: [formatSlugField(fieldToUse)],
		},
		admin: {
			position: "sidebar",
			...(slugOverrides?.admin || {}),
			components: {
				Field: {
					path: "@/payload/fields/slug/component#Slug",
					clientProps: {
						fieldToUse,
						checkboxFieldPath: checkBoxField.name,
					},
				},
			},
		},
	};

	return [slug, checkBoxField];
};