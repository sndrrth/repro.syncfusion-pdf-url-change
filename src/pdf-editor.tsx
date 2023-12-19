import { registerLicense } from "@syncfusion/ej2-base";
import {
	AjaxRequestSettingsModel,
	AllowedInteraction,
	Annotation,
	AnnotationSettingsModel,
	ContextMenuItem,
	FormFields,
	Inject,
	Magnification,
	Navigation,
	PdfViewerComponent,
	TextSearch,
	TextSelection,
	ThumbnailView,
	Toolbar,
} from "@syncfusion/ej2-react-pdfviewer";
import {
	RefObject,
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
} from "react";

registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE_KEY);

const resourceUrl = "http://localhost:5173/ej2-pdfviewer-lib/24.1.41/";

const ajaxRequestSettings: AjaxRequestSettingsModel = {
	ajaxHeaders: [],
	withCredentials: true,
};


export const PdfEditor = forwardRef<any, any>(
	function PdfEditor(props, imperativeRef) {
		const { fileName, pdfUrl, author, readOnly = false } = props;

		const ref = useRef<PdfViewerComponent>(null);
		const key = useComponentKey(props);

		const annotationSettings = useMemo(
			(): AnnotationSettingsModel => ({
				author,
				isLock: readOnly,
				allowedInteractions: readOnly ? [AllowedInteraction.Select] : undefined,
			}),
			[author, readOnly],
		);

		const onAnnotationAddOrSelectHandler = useCallback(() => {
			// The comments panel toggle button is only available in the annotation toolbar which we don't use.
			// In read-only mode, the user has no way to open the comments panel as double-clicking an annotation
			// is disabled. We therefore open the comments panel when the user selects an annotation.
			// For a consistent user experience, we also open the comments panel in edit mode.
			// We delay the opening of the comments panel to give the PDF viewer time to mark the annotation as selected (dashed border).
			setTimeout(() => ref.current?.annotationModule.showCommentsPanel(), 200);
		}, []);

		useImperativeHandle(
			imperativeRef,
			() => ({
				checkIfDirty: () => ref.current?.isDocumentEdited === true,
				save: () => {
					if (!ref.current) throw new Error("PdfEditor is not initialized");
					return ref.current.saveAsBlob();
				},
			}),
			[ref],
		);

		// useRefreshViewerOnResize(ref);

		// useNavigationBlocker({
		// 	isBlocking: () => !readOnly && ref.current?.isDocumentEdited === true,
		// 	reason: "documentChanged",
		// });

		return (
			<PdfViewerComponent
				ref={ref}
				height="500px"
				width="100%"
				documentPath={pdfUrl}
				serviceUrl=""
				resourceUrl={resourceUrl}
				ajaxRequestSettings={ajaxRequestSettings}
				enableAnnotation
				enableAnnotationToolbar={false}
				readOnly={readOnly}
				annotationSettings={annotationSettings}
				annotationSelect={onAnnotationAddOrSelectHandler}
				annotationAdd={onAnnotationAddOrSelectHandler}
				enableFormFields={false}
				contextMenuSettings={{
					contextMenuItems: readOnly ? [] : [ContextMenuItem.Highlight, ContextMenuItem.Delete],
				}}
				toolbarSettings={{
					showTooltip: true,
					annotationToolbarItems: [],
					toolbarItems: [
						"PageNavigationTool",
						"MagnificationTool",
						"PanTool",
						"SelectionTool",
						"SearchOption",
						...(readOnly ? [] : (["CommentTool"] as const)),
					],
				}}
			>
				<Inject
					services={[
						Annotation,
						FormFields,
						Toolbar,
						Magnification,
						Navigation,
						ThumbnailView,
						TextSelection,
						TextSearch,
					]}
				/>
			</PdfViewerComponent>
		);
	},
);

function useComponentKey(props: any) {
	// When switching from edit to read-only mode, we also change the available toolbar items.
	// This results in an error as the PDF viewer tries to update some form designer setting.
	// This doesn't happen when we add the FormDesigner service but this results in form fields being editable,
	// and adding `enableFormFields={false}` causes the same error.
	// We therefore force the PDF viewer to re-render when the read-only prop changes.
	return `pdf-${props.readOnly}`;
}

/**
 * Handles refreshing the PDF viewer when the container size changed.
 *
 * The PDF viewer properly resizes when the window resizes, but it doesn't
 * detect when the container width changes (e.g. split section expanded).
 */
function useRefreshViewerOnResize(ref: RefObject<PdfViewerComponent>) {
	useEffect(() => {
		const el = ref.current?.element;
		if (!el) return undefined;

		let lastWidth = window.outerWidth;
		let lastHeight = window.outerHeight;

		const observer = new ResizeObserver(() => {
			// Calling refresh() on the viewer does not help but emitting a resize event does.
			// We only do this if the container size changed because of some layout changes and not because
			// the browser window was resized as the latter is already handled by the viewer.
			if (lastWidth === window.outerWidth && lastHeight === window.outerHeight) {
				lastWidth = window.outerWidth;
				lastHeight = window.outerHeight;
				window.dispatchEvent(new Event("resize"));
			}
		});

		observer.observe(el);

		return () => observer.disconnect();
	}, [ref]);
}
