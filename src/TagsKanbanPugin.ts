import {Editor, MarkdownView, Plugin, TFile, WorkspaceLeaf} from "obsidian";
import {ExampleView, VIEW_TYPE_EXAMPLE} from "./ExampleView";
import {TagsKanbanSettingTab} from "./settings/TagsKanbanSettingTab";
import {DEFAULT_SETTINGS, TagsKanbanPluginSettings} from "./settings/TaskKanbanPluginSetting";
import {SampleModal} from "./SampleModal";
import {TAGS_KANBAN_VIEW_NAME, TagsKanbanView} from "./kanban-view/TagsKanbanView";


export class TagsKanbanPlugin extends Plugin {
	settings: TagsKanbanPluginSettings;

	async onload() {
		this.registerView(TAGS_KANBAN_VIEW_NAME, (leaf) => new TagsKanbanView(leaf));

		await this.loadSettings();

		this.switchToTagsKanbanAfterLoad();


		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TagsKanbanSettingTab(this.app, this));


		this.registerEvent(
			this.app.workspace.on("active-leaf-change", () => {
				this.switchToTagsKanbanAfterLoad();
			})
		);

		this.app.workspace.on("file-menu", (menu, file) => {
			menu.addItem((item) => {
				item.setTitle("New Tags Kanban Board")
					.setIcon("square-kanban")
					.onClick(async () => {
						const newFile = await this.app.vault.create(
							file.path + "/Tags-Kanban" + ".md",
							`---\ntags_kanban_plugin: {}\n---\n`
						);
						this.app.workspace
							.getActiveViewOfType(MarkdownView)
							?.leaf.openFile(newFile);
					});
			});
		});


		// this.registerView(
		// 	VIEW_TYPE_EXAMPLE,
		// 	(leaf) => new ExampleView(leaf)
		// );

		// This creates an icon in the left ribbon.
		// const ribbonIconEl = this.addRibbonIcon('dice', 'Tags Kanban', (evt: MouseEvent) => {
		// 	// Called when the user clicks the icon.
		// 	this.activateView();
		// });
		// Perform additional things with the ribbon
		// ribbonIconEl.addClass('task-kanban-ribbon-class');


		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	}
		// });


		// // This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });


		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}
		//
		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });


		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	private switchToTagsKanbanAfterLoad() {
		this.app.workspace.onLayoutReady(() => {
			let leaf: WorkspaceLeaf;
			for (leaf of this.app.workspace.getLeavesOfType("markdown")) {
				if (
					leaf.view instanceof MarkdownView && leaf.view.file != null &&
					this.isTagsKanbanFile(leaf.view.file)
				) {
					this.setKanbanView(leaf);
				}
			}
		});
	}

	private async setKanbanView(leaf: WorkspaceLeaf) {
		await leaf.setViewState({
			type: TAGS_KANBAN_VIEW_NAME,
			state: leaf.view.getState(),
		});
	}

	private isTagsKanbanFile(file: TFile): boolean {
		if(!file) {
			return false;
		}
		const cachedFile = this.app.metadataCache.getFileCache(file);
		return cachedFile && cachedFile.frontmatter && cachedFile.frontmatter["tags_kanban_plugin"];
	}

	async activateView(): Promise<void> {
		const { workspace } = this.app;
		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for it
			leaf = workspace.getRightLeaf(false);

			await leaf?.setViewState({ type: VIEW_TYPE_EXAMPLE, active: true });
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		if (!!leaf) {
			workspace.revealLeaf(leaf);
		}
	}

	onunload(): void {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
