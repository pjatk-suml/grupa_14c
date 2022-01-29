export const isUserWinner = (userShape, computerShape) => {
    if (userShape === computerShape) {
        return null;
    }

    if (userShape === 'ROCK') {
        return computerShape === 'SCISSORS';
    } else if (userShape === 'PAPER') {
        return computerShape === 'ROCK';
    } else {
        return computerShape === 'PAPER';
    }
}

export const getShapeAsEmoji = shape => {
    if (shape === 'ROCK') {
        return "✊"
    } else if (shape === 'PAPER') {
        return "✋"
    } else {
        return "✂"
    }
}