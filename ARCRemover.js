/*
===========================
 Automated Reddit Comment Remover
===========================
INSTRUCTIONS:

1. Go to: https://old.reddit.com/user/YOUR_USERNAME/overview
   - You **must** use old.reddit.com (not new.reddit or mobile).
   - Be sure you're logged in and can see your own comments.

2. Open the browser console (F12 → Console tab).

3. Paste and run this script.

It will:
- Edit 2 comments at a time (replace text with random garbage)
- Save them
- Delete them
- Wait 10 seconds before processing the next 2
- Stop when no editable comments remain
*/

(function deleteCommentsInBatches() {
    function generateRandomText(length) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }

    const allComments = Array.from(document.querySelectorAll("form.usertext"))
        .map((form) => {
            const editBtn = form.parentElement.querySelector("a.edit-usertext");
            const deleteBtn = form.parentElement.querySelector(".toggle.del-button .option.error .yes");
            return { form, editBtn, deleteBtn };
        })
        .filter(({ editBtn, deleteBtn }) => editBtn && deleteBtn);

    let index = 0;

    function processNextBatch() {
        if (index >= allComments.length) {
            console.log("No more comments left to process.");
            return;
        }

        const batch = allComments.slice(index, index + 2);
        batch.forEach(({ form, editBtn, deleteBtn }, i) => {
            setTimeout(() => {
                editBtn.click();
                setTimeout(() => {
                    const textarea = form.querySelector("textarea");
                    const saveBtn = form.querySelector("button.save");
                    if (textarea && saveBtn) {
                        const newText = generateRandomText(20);
                        textarea.value = newText;
                        console.log(`Comment ${index + i + 1}: Replaced with "${newText}"`);
                        saveBtn.style.display = "inline";
                        saveBtn.click();

                        setTimeout(() => {
                            console.log(`Comment ${index + i + 1}: Deleting...`);
                            deleteBtn.click();
                        }, 1500);
                    }
                }, 1000);
            }, i * 3000); // Slight stagger for each comment in the batch
        });

        index += 2;
        setTimeout(processNextBatch, 10000); // Wait 10 seconds before next batch
    }

    if (allComments.length === 0) {
        console.log("No editable comments found.");
    } else {
        console.log(`Starting batch deletion of ${allComments.length} comments...`);
        processNextBatch();
    }
})();
