import { createClient as baseCreateClient } from "@prismicio/client";
import prismicConfig from "../../prismic.config.json";

export const repositoryName = prismicConfig.repositoryName;

export const createClient = (config: Parameters<typeof baseCreateClient>[1] = {}) => {
	return baseCreateClient(repositoryName, {
		routes: prismicConfig.routes,
		...config,
	});
};
