import logger from 'loglevel'
import prefixLogger from 'loglevel-plugin-prefix'

const DEV_MODE = import.meta.env.DEV

prefixLogger.reg(logger)

if (DEV_MODE) {
	logger.enableAll()
} else {
	logger.setLevel(logger.levels.SILENT)
}

export const log = prefixLogger.apply(logger, {
	format(level, _name, timestamp) {
		return `[${timestamp}] ${level}:`
	},
})
