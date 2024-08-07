import { ItemView, WorkspaceLeaf } from "obsidian";

import Component from "./Component.svelte";

export const VIEW_TYPE_EXAMPLE = "example-view";

export class ExampleView extends ItemView {
	component: Component;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_EXAMPLE;
	}

	getDisplayText() {
		return "Example view";
	}

	async onOpen() {
		this.component = new Component({
			target: this.contentEl,
			props: {
				variable: 6,
				title: 'Tags Kanban tab'

			}
		});
	}

	async onClose() {
		this.component.$destroy();
	}
}
