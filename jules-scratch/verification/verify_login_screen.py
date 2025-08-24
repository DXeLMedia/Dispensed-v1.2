from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Capture console messages
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))

    page.goto("http://localhost:5173/#/login")

    page.wait_for_load_state('networkidle')

    expect(page.get_by_role("heading", name="DISPENSED")).to_be_visible()

    page.screenshot(path="jules-scratch/verification/login_screen.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
