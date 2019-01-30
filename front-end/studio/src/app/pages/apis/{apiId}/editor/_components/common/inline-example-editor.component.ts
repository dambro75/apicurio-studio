/**
 * @license
 * Copyright 2017 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {AfterViewInit, Component, Input, QueryList, ViewChildren, ViewEncapsulation} from "@angular/core";
import {TextAreaEditorComponent} from "./inline-editor.base";
import {CodeEditorComponent, CodeEditorMode} from "../../../../../../components/common/code-editor.component";
import {Oas20Schema, Oas30Schema} from "oai-ts-core";
import {ModelUtils} from "../../_util/model.util";
import {StringUtils} from "../../_util/object.util";
import {SelectionService} from "../../_services/selection.service";

@Component({
    moduleId: module.id,
    selector: "inline-example-editor",
    templateUrl: "inline-example-editor.component.html",
    styleUrls: [ "inline-example-editor.component.css" ],
    encapsulation: ViewEncapsulation.None
})
export class InlineExampleEditorComponent extends TextAreaEditorComponent implements AfterViewInit {

    @Input() schema: Oas20Schema | Oas30Schema;

    @ViewChildren("codeEditor") codeEditor: QueryList<CodeEditorComponent>;

    _mode: CodeEditorMode = CodeEditorMode.JSON;

    constructor(selectionService: SelectionService) {
        super(selectionService);
    }

    ngAfterViewInit(): void {
        this.codeEditor.changes.subscribe(changes => {
            if (changes.last) {
                changes.last.focus();
            }
        });
    }

    public codeEditorMode(): CodeEditorMode {
        return this._mode;
    }

    public canGenerateExample(): boolean {
        return this.schema !== null && this.schema !== undefined;
    }

    public generate(): void {
        let example: any = ModelUtils.generateExampleFromSchema(this.schema);
        let exampleStr: string = JSON.stringify(example, null, 4);
        this.codeEditor.first.setText(exampleStr);
    }

    public updateModeFromContent(text: string): void {
        if (StringUtils.isJSON(text)) {
            this._mode = CodeEditorMode.JSON;
        } else if (StringUtils.isXml(text)) {
            this._mode = CodeEditorMode.XML;
        } else {
            this._mode = CodeEditorMode.YAML;
        }
    }

}
