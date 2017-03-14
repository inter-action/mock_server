

type ENV_KEYS = "JWT_SIGNED_TOKEN" | "APP_COOKIE_KEY" | "APP_PORT" | "LOG_LEVEL";


function getEnvConfig(key: ENV_KEYS, safe = true): string {
    let result = process.env[key];

    if (safe && !result) {
        throw new Error(`no config been found for key: ${key}`);
    }
    return result;
}

export const ENV = {
    dev: "dev",
    test: "test"
}

export const ENV_UTILS = {
    is_test: () => {
        return process.env.NODE_ENV === ENV.test
    },

    get_current_env() {
        return process.env.NODE_ENV;
    },
    getEnvConfig
}
