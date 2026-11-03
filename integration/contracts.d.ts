/** Integration-side view contracts, NOT assertions about existing PaperDaily API fields. */
export type ViewState = 'ready' | 'loading' | 'empty' | 'error' | 'unauthenticated' | 'forbidden';
export type MaterialScope = 'abstract' | 'fulltext' | 'unavailable' | 'unknown';
export interface Meta { id: string; updatedAt?: string | null; }
export interface PaperView extends Meta {
  title: string; translatedTitle?: string; authors: string[]; source?: string;
  publishedAt?: string | null; doi?: string | null; url?: string;
  materialScope: MaterialScope; verified?: boolean; // material scope != quality verification
  tags: string[]; abstract?: string | null;
}
export interface ReviewRowView {
  paper: PaperView; method?: string|null; data?: string|null;
  findings?: string|null; gaps?: string|null; evidenceIds?: string[];
}
export interface QuestionView extends Meta {
  title: string; description?: string; state: string;
  paperIds: string[]; tracking: boolean;
}
export interface DatasetView extends Meta {
  name: string; aliases?: string[]; owner?: string; unit?: string;
  region?: string; period?: string; access?: string; usageCount?: number|null;
  license?: string|null; paperIds?: string[];
}
export interface PageData<T> { state: ViewState; items: T[]; total?: number|null;
  cursor?: string|null; errorMessage?: string; permissions: Record<string,boolean>; }
export interface ActionContext {
  action: string; root: HTMLElement; element: HTMLElement; signal: AbortSignal;
  data: {id: string|null; format: string|null; selectedIds: string[];
    fields: Record<string,FormDataEntryValue|FormDataEntryValue[]>; nextChecked: boolean;};
}
export interface ActionResult {ok: boolean; message?: string; checked?: boolean;}
export type HostAction = (context: ActionContext) => Promise<ActionResult> | ActionResult;
export interface MountOptions {
  actions: Record<string,HostAction>;
  onFeedback?: (feedback:{message:string;tone:string;element:HTMLElement|null})=>void;
  onError?: (error:unknown,context:{action:string})=>void;
  errorMessage?: string;
}
export interface UIController {
  root:HTMLElement;run(action:string,element:HTMLElement,fields?:Record<string,unknown>):Promise<void>;
  feedback(message:string,tone?:string,element?:HTMLElement|null):void;
  openDialog(dialog:HTMLDialogElement,opener?:HTMLElement):void;
  closeDialog(dialog:HTMLDialogElement):void;destroy():void;
}
declare global { interface Window {PaperDailyUI:{mount(root:HTMLElement,options:MountOptions):UIController;version:string};} }
