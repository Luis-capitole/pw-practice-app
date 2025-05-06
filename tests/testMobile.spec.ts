import {expect} from '@playwright/test'
import {test} from '../test-options'


 test('Input fields', async ({page}, testInfo)=>{

    await page.goto('http://localhost:4200/')
    if(testInfo.project.name == 'mobile'){
        await page.locator('.sidebar-toggle').click();
    }
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
    const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"})
    .getByRole('textbox', {name: 'Email'});
    await usingTheGridEmailInput.fill('test@test.com');
    await usingTheGridEmailInput.clear();
    await usingTheGridEmailInput.pressSequentially('test@tes2.com', {delay: 500});
})