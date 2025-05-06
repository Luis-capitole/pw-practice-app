import {Locator, Page} from '@playwright/test'
import { HelperBase } from './helperBase';

 
export class NavigationPage extends HelperBase {
    readonly formLayoutsMenuItem : Locator;
    readonly datePickerMenuItem : Locator;
    readonly smartTableMenuItem : Locator;
    readonly toastrMenuItem : Locator;
    readonly tooltipMenuItem : Locator;
    
    constructor(page: Page){
        super(page)
        this.formLayoutsMenuItem = page.getByText('Form Layouts');
        this.datePickerMenuItem = page.getByText('Datepicker');
        this.smartTableMenuItem = page.getByText('Smart Table');
        this.toastrMenuItem = page.getByText('Toastr');
        this.tooltipMenuItem = page.getByText('Tooltip');
    }
    async FormLayoutPage(){
        await this.SelectGroupMenuItem('Forms');
        await this.formLayoutsMenuItem.click();
        await this.waitForNumberOfSeconds(5);
    }

    async DatePickerPage(){
        await this.SelectGroupMenuItem('Forms');
        await this.datePickerMenuItem.click();
    }
    async SmartTablePage(){
        await this.SelectGroupMenuItem('Tables & Data');
        await this.smartTableMenuItem.click();
    }
    async ToastrPage(){
        await this.SelectGroupMenuItem('Modal & Overlays');
        await this.toastrMenuItem.click();
    }
    async TooltipPage(){
        await this.SelectGroupMenuItem('Modal & Overlays');
        await this.tooltipMenuItem.click();
    }
    private async SelectGroupMenuItem (groupItemTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupItemTitle);
        const expandedState = await groupMenuItem.getAttribute('aria-expanded');

        if(expandedState == "false"){
            await groupMenuItem.click();
        }
    }
}