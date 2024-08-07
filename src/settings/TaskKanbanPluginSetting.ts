export interface TagsKanbanPluginSettings {
	mySetting: string;
	mainTagSetting: string;
}

export const DEFAULT_SETTINGS: TagsKanbanPluginSettings = {
	mySetting: 'default',
	mainTagSetting: 'project'
}
