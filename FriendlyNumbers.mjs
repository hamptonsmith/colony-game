export default {
    billion(n) {
        return n * 1000000000;
    },
    
    million(n) {
        return n * 1000000;
    },
    
    thousand(n) {
        return n * 1000;
    },
    
    clamp(n, min, max) {
        if (n < min) {
            n = min;
        }
        else if (n > max) {
            n = max;
        }
        
        return n;
    }
};
