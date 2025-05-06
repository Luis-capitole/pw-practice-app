import {test, expect } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import { faker } from '@faker-js/faker'

test.beforeEach(async ({page}) => {
    
    await page.goto('http://localhost:4200/')
})

test('Navigate to form page @smoke', async ({page}) => {
    const pm = new PageManager(page);

    await pm.navigateTo().FormLayoutPage();
    await pm.navigateTo().DatePickerPage();
    await pm.navigateTo().SmartTablePage();
    await pm.navigateTo().ToastrPage();
    await pm.navigateTo().TooltipPage();
})

test('parametrized methods', async({page}) => {
    const pm = new PageManager(page);
    const randomFullName = faker.person.fullName();
    const randomEmail = `${randomFullName.replace(' ','')}${faker.number.int(1000)}@test.com`;

    await pm.navigateTo().FormLayoutPage();
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(randomEmail,
        'Welcome', 'Option 1');

    await page.screenshot({path: 'screeshots/formsLayoutPage.png'})
    
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName,
        randomEmail, true);
    await page.locator('nb-card', {hasText: 'Inline form'}).screenshot({path:'screeshots/inlineForm.png'})
    await pm.navigateTo().DatePickerPage();
    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(5);
    await pm.onDatepickerPage().selectDatePickerWithRangeFromToday(6, 15);
})

test.only('testing with argos ci', async ({page}) => {
    const pm = new PageManager(page);
    await pm.navigateTo().FormLayoutPage();
    await pm.navigateTo().DatePickerPage();
})