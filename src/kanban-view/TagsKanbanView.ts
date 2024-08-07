import {TextFileView, WorkspaceLeaf} from "obsidian";
import TagsKanbanViewComponent from "./TagsKanbanViewComponent.svelte";

export const TAGS_KANBAN_VIEW_NAME = "tags-kanban-view";


export class TagsKanbanView extends TextFileView {

	tagsKanbanViewComponent: TagsKanbanViewComponent;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	protected onOpen(): Promise<void> {
		this.tagsKanbanViewComponent = new TagsKanbanViewComponent({
			target: this.contentEl,
			props: {}
		});

		return;
	}

	clear(): void {
	}

	getViewType() {
		this.leaf.openFile;
		return TAGS_KANBAN_VIEW_NAME;
	}


	setViewData(data: string, clear: boolean): void {
	}

	getViewData(): string {
		return "";
	}

}
