import {test, expect } from '@playwright/test'

//test.describe.configure({mode: 'parallel'})

test.beforeEach(async ({page}) => {

    await page.goto('http://localhost:4200/')
})
    test.describe.only('Form layouts page', () =>{
        test.describe.configure({retries: 2});

        test.beforeEach(async ({page}) => {
            await page.getByText('Forms').click();
            await page.getByText('Form Layouts').click();
        })

        test('Input fields', async ({page}, testInfo)=>{

            if(testInfo.retry){
                // Do something
            }

            const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"})
            .getByRole('textbox', {name: 'Email'});

            await usingTheGridEmailInput.fill('test@test.com');
            await usingTheGridEmailInput.clear();
            await usingTheGridEmailInput.pressSequentially('test@tes2.com', {delay: 500});
            
            //Generic assertion
            
            const inputValue = await usingTheGridEmailInput.inputValue();
            expect(inputValue).toEqual('test@tes2.com1')

            //locator assertion
            await expect(usingTheGridEmailInput).toHaveValue('test@tes2.com');
        })
        test('Radion buttons', async ({page})=>{
            const usingTheGridRadioGroup = page.locator('nb-card', {hasText: "Using the Grid"});

            const radioOption1 = usingTheGridRadioGroup.getByLabel('Option 1');
            const radioOption2 = usingTheGridRadioGroup.getByRole('radio', {name: 'Option 2'});
            

            await radioOption1.check({force: true});
            await radioOption2.check({force: true});
            const radioStatus = await usingTheGridRadioGroup.getByRole('radio', {name: 'Option 2'}).isChecked();

            expect(radioStatus).toBeTruthy();
            await expect(radioOption2).toBeChecked();
            
        })
        test('Radion buttons visual testing', async ({page})=>{
            const usingTheGridRadioGroup = page.locator('nb-card', {hasText: "Using the Grid"});

            const radioStatus = usingTheGridRadioGroup.getByRole('radio', {name: 'Option 1'}).check({force: true});
            await expect(usingTheGridRadioGroup).toHaveScreenshot({maxDiffPixels: 150});
            
        })
    })
    test('Checboxes ', async ({page})=>{
        await page.getByText('Modal & Overlays').click();
        await page.getByText('Toastr').click();
        const checkBox = page.getByRole('checkbox',{name: 'Hide on click'})
        await checkBox.click({force: true});
        await checkBox.check({force: true});
        await checkBox.uncheck({force: true});

        //Check and uncheck all checkboxes in the page
        const allBoxes = page.getByRole('checkbox');
        for (const box of await allBoxes.all()){
            await box.check({force: true})
            expect(box.isChecked).toBeTruthy();
        }    
    })
    test('Lists and DropDowns ', async ({page})=>{
        const dropDownMenu = page.locator('ngx-header nb-select');
        await dropDownMenu.click();
        page.getByRole('list'); //when the list has UL tag
        page.getByRole('listitem'); // when the list has LI tag

        //const optionList = page.locator('list').locator('nb-option')
        const optionList = page.locator('nb-option-list nb-option');
        await expect(optionList).toHaveText(["Light", "Dark", "Cosmic","Corporate"])
        
        await optionList.filter({hasText: "Corporate"}).click();
        const header = page.locator('nb-layout-header');
        await expect(header).toHaveCSS('background-color','rgb(255,255,255)')

        const colors = {
            "Light": "rgb(255,255,255)",
            "Dark": "rgb(34,43,69)",
            "Cosmic": "rgb(50,50,89)",
            "Corporate": "rgb(255,255,255)",
        }

        for (const color in colors){
            optionList.filter({hasText: color});
            await expect(header).toHaveCSS('background-color',colors[color])
            if(color!= "Corporate")
                await dropDownMenu.click();
        }
    })
    test('Tooltips', async ({page})=>{
        await page.getByText('Modal & Overlays').click();
        await page.getByText('Tooltip').click();
        const toolTipCard = page.locator('nb-card', {hasText: "Tooltip Placements"});
        await toolTipCard.getByRole('button', {name: 'Top'}).hover();

        page.getByRole('tooltip') // if you have a role tooltip created
        const toolTip= await page.locator('nb-tooltip').textContent();
        expect(toolTip).toEqual('This is a tooltip')
    })
    test('Dialog Boxes', async ({page})=>{
        await page.getByText('Tables & Data').click();
        await page.getByText('Smart Table').click();

        page.on('dialog', dialog =>{
            expect(dialog.message()).toEqual('Are you sure you want to delete?');
            dialog.accept();
        })
        await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click();
        await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com');
    })
    test('Web tables', async ({page})=>{
        await page.getByText('Tables & Data').click();
        await page.getByText('Smart Table').click();

        //1 Get the row by any test in this row
        const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'});
        await targetRow.locator('.nb-edit').click();

        await page.locator('input-editor').getByPlaceholder('Age').clear();
        await page.locator('input-editor').getByPlaceholder('Age').fill('36');
        await page.locator('.nb-checkmark').click();

        //2 Get the row based on the value in the specific column
        await page.locator('.ng2-smart-pagination-nav').getByText('2').click();
        const targetRowById= page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')});
        await targetRowById.locator('.nb-edit').click();

        await page.locator('input-editor').getByPlaceholder('E-mail').clear();
        await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com');
        await page.locator('.nb-checkmark').click();

        await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

        //3 Test filter of the table

        const ages = ["20", "30", "40", "200"];

        for (let age of ages){
            await page.locator('input-filter').getByPlaceholder('Age').clear();
            await page.locator('input-filter').getByPlaceholder('Age').fill(age);
            await page.waitForTimeout(500);
            const ageRows = page.locator('tbody tr');

            for(let row of await ageRows.all()){
                const cellValue = await row.locator('td').last().textContent();
                if(age == "200"){
                    expect(cellValue).toEqual(' No data found ');
                }
                else{
                    expect(cellValue).toEqual(age);
                }
            }
        }
    })

    test('DatePicker', async ({page}) => {
        await page.getByText('Forms').click();
        await page.getByText('Datepicker').click();
        const datePickerContainer = page.locator('nb-card',{hasText: 'Common Datepicker'})
        const calendarInputField = datePickerContainer.getByPlaceholder('Form Picker');
        await calendarInputField.click();

        await page.locator('[class="day-cell ng-star-inserted"]').getByText('14').click();
        await calendarInputField.click();

        let date = new Date();
        //date.setDate(date.getDate() + 1) funciona si es el mismo mes
        date.setDate(date.getDate() + 14)
        const expectedDate = date.getDate().toString();

        const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'});
        const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'});
        const expectedYear = date.toLocaleString('En-US', {year: 'numeric'});
        let dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

        let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`

        while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
            await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
            calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent();
        }

        await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click();
        await expect(calendarInputField).toHaveValue(dateToAssert)

    })

    test('Sliders', async ({page}) => {
        //Update attribute
        const tempGauge = page.locator('[tabtitle= "Temperature"] ngx-temperature-dragger circle')

        await tempGauge.evaluate(node => {
            node.setAttribute('cx', '232.630');
            node.setAttribute('cy', '232.630');
        })
        await tempGauge.click();

        //Mouse movement
        const tempBox = page.locator('[tabtitle= "Temperature"] ngx-temperature-dragger')
        await tempBox.scrollIntoViewIfNeeded();

        const box = await tempBox.boundingBox();
        const x = box.x + box.width / 2;
        const y = box.y + box.height / 2;

        await page.mouse.move(x,y);//Empieza desde el centro del elemento 
        await page.mouse.down();
        await page.mouse.move(x - 100, y);
        await page.mouse.move(x - 100, y + 100);
        await page.mouse.up();

        await expect(tempBox).toContainText('13')
    })

