let p1 = 0;
let p2 = 0;
let homeTeam = "Glenforest";
let away = "Lozersss";

// Timer button dimensions
let timerButtonWidth = 120;
let timerButtonHeight = 60;

// Score button dimensions
let scoreButtonWidth = 90;
let scoreButtonHeight = 50;

let space = 20;
let buttonSpacing = 20;
let buttonOff = 15;

// Card dimensions
let cardWidth = 350;
let cardHeight = 400;
let card1X, card1Y, card2X, card2Y;

// Score buttons for team 1
let team1_btn_plus1_X, team1_btn_plus1_Y;
let team1_btn_plus2_X, team1_btn_plus2_Y;
let team1_btn_minus1_X, team1_btn_minus1_Y;

// Score buttons for team 2
let team2_btn_plus1_X, team2_btn_plus1_Y;
let team2_btn_plus2_X, team2_btn_plus2_Y;
let team2_btn_minus1_X, team2_btn_minus1_Y;

// Timer
let scoreDisX, scoreDisY, scoreDisW, scoreDisH;
let startX, startY, stopX, stopY;
let hornX, hornY, resetX, resetY;
let hornSound;

// Timer logic
let totalMillis = 0;
let timerRunning = false;
let lastUpdate = 0;

// Score change animation
let p1Glow = 0;
let p2Glow = 0;
let p1GlowColor = "gold";
let p2GlowColor = "gold";
let p1ScaleAnim = 0;
let p2ScaleAnim = 0;

// Button press animation
let pressedButton = null;
let pressTimer = 0;

function preload() {
    hornSound = loadSound("gameBuzzer.mp3");
}

function setup() {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';

    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('display', 'block');

    textFont('Teko, sans-serif');

    scoreDisW = 600;
    scoreDisH = 200;

    setPositions();
    lastUpdate = millis();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    setPositions();
}

function setPositions() {
    card1X = width * 0.25 - cardWidth / 2;
    card2X = width * 0.75 - cardWidth / 2;
    
    // Calculate total block height: timer + gap + cards
    let verticalGap = constrain(height * 0.08, 40, 120); // gap between timer and cards
    let totalBlockHeight = scoreDisH + verticalGap + cardHeight;
    
    // Center the entire block vertically
    let topY = (height - totalBlockHeight) / 2 - 10;
    
    // Timer position (starts at topY)
    scoreDisX = width / 2 - scoreDisW / 2;
    scoreDisY = topY;
    
    // Store fixed text center for timer
    timerTextX = scoreDisX + scoreDisW / 2;
    timerTextY = scoreDisY + scoreDisH / 2;
    
    // Timer buttons
    startX = scoreDisX + scoreDisW + buttonSpacing;
    startY = scoreDisY + scoreDisH / 2 - timerButtonHeight / 2 - buttonOff;
    stopX = startX;
    stopY = startY + timerButtonHeight + buttonSpacing;

    resetX = scoreDisX - timerButtonWidth - buttonSpacing;
    resetY = scoreDisY + scoreDisH / 2 - timerButtonHeight / 2 - buttonOff;

    hornX = resetX;
    hornY = resetY + timerButtonHeight + buttonSpacing;

    // Card positions (placed below timer with verticalGap)
    card1Y = scoreDisY + scoreDisH + verticalGap;
    card2Y = card1Y;

    // Button positioning within cards
    let buttonRowY = cardHeight - 75;
    let buttonCenterX = cardWidth / 2;
    let buttonTotalWidth = scoreButtonWidth * 3 + space * 2;
    let startButtonX = buttonCenterX - buttonTotalWidth / 2;

    // Team 1 buttons (left card)
    team1_btn_plus2_X = card1X + startButtonX;
    team1_btn_plus2_Y = card1Y + buttonRowY;

    team1_btn_plus1_X = team1_btn_plus2_X + scoreButtonWidth + space;
    team1_btn_plus1_Y = card1Y + buttonRowY;

    team1_btn_minus1_X = team1_btn_plus1_X + scoreButtonWidth + space;
    team1_btn_minus1_Y = card1Y + buttonRowY;

    // Team 2 buttons (right card)
    team2_btn_plus2_X = card2X + startButtonX;
    team2_btn_plus2_Y = card2Y + buttonRowY;

    team2_btn_plus1_X = team2_btn_plus2_X + scoreButtonWidth + space;
    team2_btn_plus1_Y = card2Y + buttonRowY;

    team2_btn_minus1_X = team2_btn_plus1_X + scoreButtonWidth + space;
    team2_btn_minus1_Y = card2Y + buttonRowY;
}

function draw() {
    // Background gradient
    let gradBg = drawingContext.createLinearGradient(0, 0, width, height);
    gradBg.addColorStop(0, '#4facfe');
    gradBg.addColorStop(1, '#00f2fe');
    drawingContext.fillStyle = gradBg;
    drawingContext.fillRect(0, 0, width, height);

    drawTimerBox();
    drawTimerButtons();
    drawScoreCards();

    if (p1Glow > 0) p1Glow -= 2;
    if (p2Glow > 0) p2Glow -= 2;
    if (p1ScaleAnim > 0) p1ScaleAnim -= 0.05;
    if (p2ScaleAnim > 0) p2ScaleAnim -= 0.05;

    if (pressTimer > 0) {
        pressTimer--;
        if (pressTimer === 0) pressedButton = null;
    }
}

function drawTimerBox() {
    // Add shadow to timer
    drawingContext.shadowOffsetX = 6;
    drawingContext.shadowOffsetY = 6;
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = "rgba(0,0,0,0.4)";

    // Gradient background (same as before)
    let seconds = totalMillis / 1000;
    let maxTime = 90;
    let timeRatio = constrain(seconds / maxTime, 0, 1);

    colorMode(HSB, 360, 100, 100);
    let c1 = color(timeRatio * 200, 80, 85);
    let c2 = color(timeRatio * 240, 70, 90);
    colorMode(RGB, 255);

    let gradBox = drawingContext.createLinearGradient(
        scoreDisX,
        scoreDisY,
        scoreDisX + scoreDisW,
        scoreDisY + scoreDisH
    );
    gradBox.addColorStop(0, `rgb(${red(c1)}, ${green(c1)}, ${blue(c1)})`);
    gradBox.addColorStop(1, `rgb(${red(c2)}, ${green(c2)}, ${blue(c2)})`);
    drawingContext.fillStyle = gradBox;
    rect(scoreDisX, scoreDisY, scoreDisW, scoreDisH, 20);

    // Pulsing border (same as before)
    if (timerRunning) {
        let pulseAmount = sin(frameCount * 0.1) * 0.5 + 0.5;
        let pulseAlpha = pulseAmount * 0.6 + 0.4;
        noFill();
        strokeWeight(4);
        stroke(255, 255, 255, pulseAlpha * 255);
        rect(scoreDisX, scoreDisY, scoreDisW, scoreDisH, 20);
        noStroke();
    }

    // Clear shadow
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;

    // Timer logic
    if (timerRunning) {
        let delta = millis() - lastUpdate;
        totalMillis -= delta;
        if (totalMillis <= 0) {
            totalMillis = 0;
            timerRunning = false;
            if (hornSound && hornSound.isLoaded()) hornSound.play();
        }
        lastUpdate = millis();
    }

    // Format timer
    let minutes = floor(totalMillis / 60000);
    let secs = floor((totalMillis % 60000) / 1000);
    let millisecs = floor((totalMillis % 1000) / 10);

    let timeText = nf(minutes, 2) + ":" + nf(secs, 2) + ":" + nf(millisecs, 2);

    fill(255);
    textFont('Arial'); // easier-to-read font
    textAlign(LEFT, CENTER);

    // Start with a big font size
    let fontSize = scoreDisH / 1.3;
    textSize(fontSize);

    // Reduce font size until text fits in rectangle
    while (textWidth(timeText) > scoreDisW - 40) { // 40px padding
        fontSize -= 1;
        textSize(fontSize);
    }

    // Center the text horizontally
    let fixedX = scoreDisX + (scoreDisW - textWidth(timeText)) / 2;
    let fixedY = scoreDisY + scoreDisH / 2;

    text(timeText, fixedX, fixedY);
}



function drawTimerButtons() {
    drawTimerButton(resetX, resetY, "Reset");
    drawTimerButton(hornX, hornY, "Horn");
    drawTimerButton(startX, startY, "Start");
    drawTimerButton(stopX, stopY, "Stop");
}

function drawScoreCards() {
    // Draw left card (team 1)
    drawCard(card1X, card1Y, homeTeam, p1, p1Glow, p1GlowColor, p1ScaleAnim,
             team1_btn_plus2_X, team1_btn_plus2_Y,
             team1_btn_plus1_X, team1_btn_plus1_Y,
             team1_btn_minus1_X, team1_btn_minus1_Y);
    
    // Draw right card (team 2)
    drawCard(card2X, card2Y, away, p2, p2Glow, p2GlowColor, p2ScaleAnim,
             team2_btn_plus2_X, team2_btn_plus2_Y,
             team2_btn_plus1_X, team2_btn_plus1_Y,
             team2_btn_minus1_X, team2_btn_minus1_Y);
}

function drawCard(x, y, teamName, score, glowAmount, glowColor, scaleAnim, btn1X, btn1Y, btn2X, btn2Y, btn3X, btn3Y) {
    // Card shadow
    drawingContext.shadowOffsetX = 6;
    drawingContext.shadowOffsetY = 6;
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = "rgba(0,0,0,0.25)";
    
    // Glow effect when score changes
    if (glowAmount > 0) {
        drawingContext.shadowBlur = 30;
        if (glowColor === "red") {
            drawingContext.shadowColor = `rgba(255, 0, 0, ${glowAmount / 60})`;
        } else {
            drawingContext.shadowColor = `rgba(255, 215, 0, ${glowAmount / 100})`;
        }
    }
    
    // Card background
    fill(240, 248, 255, 220);
    rect(x, y, cardWidth, cardHeight, 25);
    
    // Colored border gradient
    noFill();
    strokeWeight(3);
    let borderGrad = drawingContext.createLinearGradient(x, y, x + cardWidth, y + cardHeight);
    borderGrad.addColorStop(0, "rgba(54, 209, 220, 0.6)");
    borderGrad.addColorStop(1, "rgba(91, 134, 229, 0.6)");
    drawingContext.strokeStyle = borderGrad;
    rect(x, y, cardWidth, cardHeight, 25);
    
    // Clear shadow and stroke
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;
    noStroke();
    
    // Team name
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(50);
    textStyle(BOLD);
    text(teamName, x + cardWidth / 2, y + 60);
    textStyle(NORMAL);
    
    // Score with bounce animation
    let scoreScale = 1.0 + (scaleAnim * 0.3);
    let scaledSize = 200 * scoreScale;
    
    textSize(scaledSize);
    fill(0);
    text(score, x + cardWidth / 2, y + 220);
    
    // Reset text size
    textSize(12);
    
    // Buttons
    drawScoreButton(btn1X, btn1Y, "+2");
    drawScoreButton(btn2X, btn2Y, "+1");
    drawScoreButton(btn3X, btn3Y, "-1");
}

function drawScoreButton(x, y, label) {
    // Create unique button ID for press detection
    let buttonId = `${x}-${y}`;
    let isPressed = (pressedButton === buttonId);
    
    // Check if hovering
    let isHovered = mouseX > x && mouseX < x + scoreButtonWidth && mouseY > y && mouseY < y + scoreButtonHeight;
    
    // Scale factor
    let scale = isPressed ? 0.95 : (isHovered ? 1.1 : 1.0);
    let scaledWidth = scoreButtonWidth * scale;
    let scaledHeight = scoreButtonHeight * scale;
    
    // Adjust position to keep button centered when scaling
    let adjustedX = x - (scaledWidth - scoreButtonWidth) / 2;
    let adjustedY = y - (scaledHeight - scoreButtonHeight) / 2;
    
    // Add shadow
    if (isPressed) {
        drawingContext.shadowOffsetX = 1;
        drawingContext.shadowOffsetY = 1;
        drawingContext.shadowBlur = 3;
    } else {
        drawingContext.shadowOffsetX = 3;
        drawingContext.shadowOffsetY = 3;
        drawingContext.shadowBlur = 8;
    }
    drawingContext.shadowColor = "rgba(0,0,0,0.15)";
    
    // Button color
    if (isPressed) {
        fill("#ff9fb0");
    } else if (isHovered) {
        fill("#ffc4d0");
    } else {
        fill("#ffe4e9");
    }
    
    stroke(0, 0, 0, 30);
    strokeWeight(2);
    rect(adjustedX, adjustedY, scaledWidth, scaledHeight, 10);
    noStroke();
    
    // Clear shadow
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;
    
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(28);
    textStyle(BOLD);
    text(label, adjustedX + scaledWidth / 2, adjustedY + scaledHeight / 2);
    textStyle(NORMAL);
}

function drawTimerButton(x, y, label) {
    // Create unique button ID
    let buttonId = `timer-${x}-${y}`;
    let isPressed = (pressedButton === buttonId);
    
    // Check if hovering
    let isHovered = mouseX > x && mouseX < x + timerButtonWidth && mouseY > y && mouseY < y + timerButtonHeight;
    
    // Scale factor
    let scale = isPressed ? 0.95 : (isHovered ? 1.1 : 1.0);
    let scaledWidth = timerButtonWidth * scale;
    let scaledHeight = timerButtonHeight * scale;
    
    // Adjust position
    let adjustedX = x - (scaledWidth - timerButtonWidth) / 2;
    let adjustedY = y - (scaledHeight - timerButtonHeight) / 2;
    
    // Add shadow
    if (isPressed) {
        drawingContext.shadowOffsetX = 2;
        drawingContext.shadowOffsetY = 2;
        drawingContext.shadowBlur = 5;
    } else {
        drawingContext.shadowOffsetX = 4;
        drawingContext.shadowOffsetY = 4;
        drawingContext.shadowBlur = 10;
    }
    drawingContext.shadowColor = "rgba(0,0,0,0.2)";
    
    // Button color
    if (isPressed) {
        fill("#2e7bb5");
    } else if (isHovered) {
        fill("#5dade2");
    } else {
        fill("#2e86c1");
    }
    
    stroke(255, 255, 255, 50);
    strokeWeight(2);
    rect(adjustedX, adjustedY, scaledWidth, scaledHeight, 10);
    noStroke();
    
    // Clear shadow
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;
    
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(35);
    text(label, adjustedX + scaledWidth / 2, adjustedY + scaledHeight / 2);
}

function mousePressed() {
    // Team 1 score buttons
    if (isPointInRect(mouseX, mouseY, team1_btn_plus1_X, team1_btn_plus1_Y, scoreButtonWidth, scoreButtonHeight)) {
        pressedButton = `${team1_btn_plus1_X}-${team1_btn_plus1_Y}`;
        pressTimer = 10;
        p1++;
        p1Glow = 100;
        p1GlowColor = "gold";
        p1ScaleAnim = 1.0;
    }
    if (isPointInRect(mouseX, mouseY, team1_btn_plus2_X, team1_btn_plus2_Y, scoreButtonWidth, scoreButtonHeight)) {
        pressedButton = `${team1_btn_plus2_X}-${team1_btn_plus2_Y}`;
        pressTimer = 10;
        p1 += 2;
        p1Glow = 100;
        p1GlowColor = "gold";
        p1ScaleAnim = 1.0;
    }
    if (isPointInRect(mouseX, mouseY, team1_btn_minus1_X, team1_btn_minus1_Y, scoreButtonWidth, scoreButtonHeight)) {
        pressedButton = `${team1_btn_minus1_X}-${team1_btn_minus1_Y}`;
        pressTimer = 10;
        if (p1 > 0) {
            p1--;
            p1Glow = 100;
            p1GlowColor = "red";
            p1ScaleAnim = 1.0;
        }
    }
    
    // Team 2 score buttons
    if (isPointInRect(mouseX, mouseY, team2_btn_plus1_X, team2_btn_plus1_Y, scoreButtonWidth, scoreButtonHeight)) {
        pressedButton = `${team2_btn_plus1_X}-${team2_btn_plus1_Y}`;
        pressTimer = 10;
        p2++;
        p2Glow = 100;
        p2GlowColor = "gold";
        p2ScaleAnim = 1.0;
    }
    if (isPointInRect(mouseX, mouseY, team2_btn_plus2_X, team2_btn_plus2_Y, scoreButtonWidth, scoreButtonHeight)) {
        pressedButton = `${team2_btn_plus2_X}-${team2_btn_plus2_Y}`;
        pressTimer = 10;
        p2 += 2;
        p2Glow = 100;
        p2GlowColor = "gold";
        p2ScaleAnim = 1.0;
    }
    if (isPointInRect(mouseX, mouseY, team2_btn_minus1_X, team2_btn_minus1_Y, scoreButtonWidth, scoreButtonHeight)) {
        pressedButton = `${team2_btn_minus1_X}-${team2_btn_minus1_Y}`;
        pressTimer = 10;
        if (p2 > 0) {
            p2--;
            p2Glow = 100;
            p2GlowColor = "red";
            p2ScaleAnim = 1.0;
        }
    }
    
    // Timer button clicks
    if (isPointInRect(mouseX, mouseY, resetX, resetY, timerButtonWidth, timerButtonHeight)) {
        pressedButton = `timer-${resetX}-${resetY}`;
        pressTimer = 10;
        p1 = 0;
        p2 = 0;
        totalMillis = 0;
        p1Glow = 0;
        p2Glow = 0;
    }
    
    if (isPointInRect(mouseX, mouseY, hornX, hornY, timerButtonWidth, timerButtonHeight)) {
        pressedButton = `timer-${hornX}-${hornY}`;
        pressTimer = 10;
        if (hornSound.isPlaying()) hornSound.stop();
        hornSound.play();
    }
    
    if (isPointInRect(mouseX, mouseY, startX, startY, timerButtonWidth, timerButtonHeight)) {
        pressedButton = `timer-${startX}-${startY}`;
        pressTimer = 10;
        timerRunning = true;
        lastUpdate = millis();
    }
    
    if (isPointInRect(mouseX, mouseY, stopX, stopY, timerButtonWidth, timerButtonHeight)) {
        pressedButton = `timer-${stopX}-${stopY}`;
        pressTimer = 10;
        timerRunning = false;
    }
    
    // Click on team name to edit
    if (mouseX > card1X && mouseX < card1X + cardWidth && 
        mouseY > card1Y && mouseY < card1Y + 100) {
        let input = prompt("Enter home team name:", homeTeam);
        if (input) homeTeam = input.trim();
    }
    
    if (mouseX > card2X && mouseX < card2X + cardWidth && 
        mouseY > card2Y && mouseY < card2Y + 100) {
        let input = prompt("Enter away team name:", away);
        if (input) away = input.trim();
    }
    
    // Timer box click
    if (mouseX > scoreDisX && mouseX < scoreDisX + scoreDisW && 
        mouseY > scoreDisY && mouseY < scoreDisY + scoreDisH) {
        let input = prompt("Enter time as MM:SS");
        if (!input) return;
        input = input.trim();
        
        let m = 0, s = 0;
        if (input.includes(":")) {
            let parts = input.split(":");
            m = int(parts[0]);
            s = int(parts[1]);
        } else {
            let num = int(input);
            m = floor(num / 100);
            s = num % 100;
        }
        
        if (s >= 60) s = 59;
        if (isNaN(m) || isNaN(s) || m < 0 || s < 0) {
            alert("Invalid time");
            return;
        }
        
        totalMillis = (m * 60 + s) * 1000;
        lastUpdate = millis();
    }
}

function isPointInRect(px, py, rx, ry, rw, rh) {
    return px > rx && px < rx + rw && py > ry && py < ry + rh;
}

function keyPressed() {
    // Spacebar - Toggle timer
    if (key === ' ') {
        if (timerRunning) {
            timerRunning = false;
        } else {
            timerRunning = true;
            lastUpdate = millis();
        }
        return false;
    }
    
    // H - Horn
    if (key === 'h' || key === 'H') {
        if (hornSound.isPlaying()) hornSound.stop();
        hornSound.play();
    }
    
    // R - Reset
    if (key === 'r' || key === 'R') {
        p1 = 0;
        p2 = 0;
        totalMillis = 0;
        p1Glow = 0;
        p2Glow = 0;
    }
}