var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
dotenv.config();
var app = express();
var port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
var client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});
var conversationHistory = [];
app.post('/chat', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var message, response, assistantMessage, error_1, errorMessage, details, errorType;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                message = req.body.message;
                if (!message || typeof message !== 'string') {
                    return [2 /*return*/, res.status(400).json({ error: 'Message is required' })];
                }
                if (!process.env.ANTHROPIC_API_KEY) {
                    return [2 /*return*/, res.status(500).json({
                            error: 'ANTHROPIC_API_KEY is not set. Please check your .env file.',
                            details: 'Missing ANTHROPIC_API_KEY',
                        })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                conversationHistory.push({
                    role: 'user',
                    content: message,
                });
                return [4 /*yield*/, client.messages.create({
                        model: 'claude-3-5-sonnet-20241022',
                        max_tokens: 1024,
                        system: 'You are a helpful and friendly assistant. Provide clear, concise, and informative responses.',
                        messages: conversationHistory,
                    })];
            case 2:
                response = _a.sent();
                assistantMessage = response.content[0].type === 'text' ? response.content[0].text : 'Unable to process response';
                conversationHistory.push({
                    role: 'assistant',
                    content: assistantMessage,
                });
                res.json({ response: assistantMessage });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error('Anthropic API Error:', error_1);
                errorMessage = 'Failed to get response from Claude';
                details = 'Unknown error occurred';
                errorType = 'unknown';
                if (error_1 instanceof Error) {
                    details = error_1.message;
                    if (error_1.message.includes('401') ||
                        error_1.message.includes('authentication') ||
                        error_1.message.includes('invalid_api_key') ||
                        error_1.message.includes('Unauthorized')) {
                        errorMessage = 'Invalid or expired API key';
                        errorType = 'invalid_api_key';
                        details = 'Your ANTHROPIC_API_KEY is invalid or has expired';
                    }
                    else if (error_1.message.includes('timeout')) {
                        errorMessage = 'Request timeout';
                        errorType = 'timeout';
                        details = 'The request took too long. Please try again.';
                    }
                    else if (error_1.message.includes('429')) {
                        errorMessage = 'Rate limit exceeded';
                        errorType = 'rate_limit';
                        details = 'Too many requests. Please wait a moment and try again.';
                    }
                    else if (error_1.message.includes('ECONNREFUSED')) {
                        errorMessage = 'Cannot connect to Anthropic API';
                        errorType = 'connection';
                        details = 'Check your internet connection and try again';
                    }
                    else if (error_1.message.includes('quota')) {
                        errorMessage = 'API quota exceeded';
                        errorType = 'quota';
                        details = 'Your Anthropic API account has reached its quota';
                    }
                    else {
                        errorType = 'api_error';
                    }
                }
                res.status(500).json({
                    error: errorMessage,
                    details: details,
                    errorType: errorType,
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get('/health', function (req, res) {
    res.json({ status: 'ok' });
});
// Validate API key on startup
var validateApiKey = function () {
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.trim() === '' || process.env.ANTHROPIC_API_KEY === 'your_actual_anthropic_api_key_here') {
        console.error('\n❌ ERROR: ANTHROPIC_API_KEY is not set or is invalid!\n');
        console.error('📋 Instructions:');
        console.error('1. Get your API key from: https://console.anthropic.com');
        console.error('2. Open the .env file in this directory');
        console.error('3. Replace "your_actual_anthropic_api_key_here" with your actual API key');
        console.error('4. Save the file and restart the server\n');
        console.error('Example .env file:');
        console.error('ANTHROPIC_API_KEY=sk-ant-xxx...your-key-here');
        console.error('PORT=3001\n');
        process.exit(1);
    }
};
validateApiKey();
app.listen(port, function () {
    console.log("\u2705 Server running at http://localhost:".concat(port));
    console.log('✅ Chat API available at POST /chat');
    console.log('🚀 Frontend: http://localhost:5173');
});
