import { createContext } from "react";

const defaultFavicon = process.env.AVATAR ? `//wsrv.nl/?url=${process.env.AVATAR}&w=144&h=144&mask=circle` : '/favicon.ico'
export const defaultClientConfig = new Map(Object.entries({
    "favicon": defaultFavicon,
    "counter.enabled": true,
    "friend_apply_enable": true,
}))

export const defaultServerConfig = new Map(Object.entries({
    "friend_apply_auto_accept": false,
    "friend_crontab": true,
    "friend_ua":"Rin-Check/0.1.0"
}))

export class ConfigWrapper {
    config: any;
    defaultConfig: Map<string, any>
    constructor(config: any, defaultConfig: Map<string, any>) {
        this.config = config;
        this.defaultConfig = defaultConfig;
    }
    get<T>(key: string) {
        if (this.config[key] != undefined) {
            return this.config[key] as T;
        }
        if (this.defaultConfig.has(key)) {
            return this.defaultConfig.get(key) as T;
        }
    }
    default<T>(key: string) {
        return this.defaultConfig.get(key) as T;
    }
}

export const defaultClientConfigWrapper = new ConfigWrapper({}, defaultClientConfig);
export const defaultServerConfigWrapper = new ConfigWrapper({}, defaultServerConfig);

export const ClientConfigContext = createContext<ConfigWrapper>(defaultClientConfigWrapper);
export const ServerConfigContext = createContext<ConfigWrapper>(defaultServerConfigWrapper);
