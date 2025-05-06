import {expect} from '@playwright/test'
import {test} from '../test-options'

test('Drag and drops', async ({page, globalsQaURL}) => {
    //const url = process.env.URL;
    await page.goto(globalsQaURL)
    const iFrame = page.frameLocator('[rel-title="Photo Manager"] iframe');
    await iFrame.locator('li', {hasText: 'High Tatras 2'}).dragTo(iFrame.locator('#trash'))

    //More presice control 
    await iFrame.locator('li', {hasText: 'High Tatras 4'}).hover();
    await page.mouse.down({button: 'left'});
    await iFrame.locator('#trash').hover();
    await page.mouse.up();

    await expect(iFrame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])
})