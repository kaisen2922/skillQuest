const fs = require('fs');

function fixMojibake(filePath) {
    let content = fs.readFileSync(filePath);
    
    // The content is a UTF-8 string that contains Mojibake of UTF-8 decoded as Win-1252/Latin-1.
    // So if we read the string as UTF-8, we get literal 'âœ¨'.
    // We want to convert 'âœ¨' back to bytes (which are 0xE2 0x9C 0xA8).
    // In Node.js, we can try to treat the UTF-8 string as latin1, which gives us the raw bytes, 
    // and then parse those raw bytes as utf8!
    
    let strContent = content.toString('utf8');
    
    try {
        // Convert the "latin1" characters back to a buffer
        let buf = Buffer.from(strContent, 'latin1');
        // Decode the buffer as utf8
        let fixedStr = buf.toString('utf8');
        
        // If it still contains "", then it means the latin1 trick wasn't a perfect 1-to-1 conversion 
        // (Windows-1252 has some characters differing from iso-8859-1).
        // Let's do a simple replace for known bad sequences if needed, 
        // but Buffer.from(str, 'latin1') works for raw 8-bit passthrough in standard cases.
        // Wait! Sometimes Windows-1252 is used. 
        // "â”€" (U+2500) encodes as E2 94 80. E2 is â. 94 is ” (smart quote in win1252). 80 is € (euro in win1252).
        
        // Let's just use a dedicated replacement based on Windows-1252 mapping for the buffer encoding.
    } catch (e) {
        console.error(e);
    }
}
