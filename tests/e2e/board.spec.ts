import 'dotenv/config'

import { test, expect } from '@playwright/test'

test.describe('TaskLeafy', () => {
  const accountEmail = process.env.E2E_ACCOUNT_EMAIL
  const accountPassword = process.env.E2E_ACCOUNT_PASSWORD

  if (!accountEmail || !accountPassword)
    throw new Error(
      'Variables: E2E_ACCOUNT_EMAIL, E2E_ACCOUNT_PASSWORD are required'
    )

  test('Board', async ({ page }) => {
    const randomNumber = Math.floor(Math.random() * 1000)
    const taskName = `Task ${randomNumber}`

    await test.step('should authenticate', async () => {
      await page.goto('/')
      await page.getByRole('button').first().click()
      await page.getByRole('button').first().click()
      await page.getByLabel('EMAIL OR PHONE NUMBER').fill(accountEmail)
      await page.getByLabel('PASSWORD').fill(accountPassword)
      await page.locator('[type=submit]').click()

      await page.waitForURL(/\/oauth2\/authorize(?!\/)/)
      await page.getByRole('button', { name: 'Authorize' }).click()

      await page.waitForURL('**/board')
      expect(page.url()).toContain('board')
    })

    await test.step('should add new task', async () => {
      await page.getByRole('button', { name: 'Add task' }).click()

      await page.getByLabel('Task name').fill(taskName)

      await page.getByRole('button', { name: 'Add' }).click()
      await page.locator('[aria-label=Close]').click()

      await expect(page.getByText(taskName).first()).toBeVisible()
    })

    await test.step('should update task', async () => {
      const description = `New description ${randomNumber}`

      await page.getByText(taskName).first().locator('..').locator('..').click()

      await page.getByLabel('Description').fill(description)

      await page.getByRole('button', { name: 'Update' }).click()
      await page.locator('[aria-label=Close]').click()

      await expect(page.getByText(description)).toBeVisible()
    })
  })
})
