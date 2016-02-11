# Shindig edX XBlock
====================
1. Install xBlock to the open edx from next repo: `git@github.com:raccoongang/shindig-xblock.git`

2. Contact Shindig representative in order to obtain the following data:
    * `"shindig_server_user:<username>:<password>",`
    * `"shindig_auth:<client_id>:<client_secret>",`
    * `“shindig_user:<username>:<password>”`.

3. Change Course Advanced Settings in Open edX.
    * Open a course you are authoring and select `"Settings" ⇒ "Advanced Settings”`. 
    * Navigate to the section titled `"Advanced Module List"`. Add `"shindigwidget"` to modules list.
    ![Alt text](/doc/images/image_1.png?raw=true "image")
    * Navigate to the section titled `"LTI Passports"`. Add `"shindig_server_user:<username>:<password>", "shindig_auth:<client_id>:<client_secret>", “shindig_user:<username>:<password>”` to module list. Use User and oauth data obtained from Shindig representative in #2
    ![Alt text](/doc/images/image_2.png?raw=true "image")

4. Create an shindigwidget XBlock
    * In the `"Add New Component"` interface, you should now see an `"Advanced"` button
    ![Alt text](/doc/images/image_3.png?raw=true "image")
    * Click `"Advanced"` and choose `"shindigwidget"`
    ![Alt text](/doc/images/image_4.png?raw=true "image")


5. Create an shindigwidget page-XBlock
    * Open a course you are authoring and select `"Content" ⇒ "Pages”`.
    * Create new page for shindigwidget page-XBlock
    * Edit this page, on the tab “settings” change `“Editor”` field with `“Raw”` value. Save changes
    ![Alt text](/doc/images/image_5.png?raw=true "image")
    * In Courseware open shindig xBlock, on tab `“EMBED CODE”` find textarea with code. Copy it.
    ![Alt text](/doc/images/image_6.png?raw=true "image")
    * Paste copied code to previous page.
    ![Alt text](/doc/images/image_7.png?raw=true "image")
    * Save it
