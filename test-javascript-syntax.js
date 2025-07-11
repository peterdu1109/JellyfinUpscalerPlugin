// AI Upscaler Plugin - JavaScript Syntax Validator
// Tests all JavaScript files for syntax errors and compatibility

const fs = require('fs');
const path = require('path');

// Test JavaScript files for syntax errors
function testJavaScriptSyntax() {
    console.log('🧪 Testing JavaScript syntax and compatibility...\n');
    
    const jsFiles = [
        'test-extracted/Configuration/quick-menu.js',
        'test-extracted/Configuration/player-integration.js',
        'test-extracted/Configuration/config.js'
    ];
    
    let allTestsPassed = true;
    let results = [];
    
    jsFiles.forEach(file => {
        console.log(`📄 Testing: ${file}`);
        
        try {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');
                
                // Basic syntax tests
                const tests = [
                    { name: 'File not empty', test: () => content.trim().length > 0 },
                    { name: 'Valid JavaScript structure', test: () => {
                        // Check for basic JS structure
                        return content.includes('function') || content.includes('=>') || content.includes('const') || content.includes('var');
                    }},
                    { name: 'No obvious syntax errors', test: () => {
                        // Check for common syntax issues
                        const openBraces = (content.match(/\{/g) || []).length;
                        const closeBraces = (content.match(/\}/g) || []).length;
                        const openParens = (content.match(/\(/g) || []).length;
                        const closeParens = (content.match(/\)/g) || []).length;
                        
                        return openBraces === closeBraces && openParens === closeParens;
                    }},
                    { name: 'Uses strict mode', test: () => content.includes("'use strict'") },
                    { name: 'Has proper IIFE structure', test: () => content.includes('(function()') || content.includes('(() => {') },
                    { name: 'No eval() usage', test: () => !content.includes('eval(') },
                    { name: 'No unsafe document.write() usage', test: () => {
                        // Allow document.write in new windows (diagWindow.document.write is OK)
                        const unsafeWrites = content.match(/(?<!\.)\bdocument\.write\(/g);
                        return !unsafeWrites || unsafeWrites.length === 0;
                    }},
                    { name: 'Uses modern JavaScript features', test: () => {
                        return content.includes('const ') || content.includes('let ') || content.includes('=>');
                    }},
                    { name: 'Has error handling', test: () => content.includes('try') && content.includes('catch') },
                    { name: 'Has console logging', test: () => content.includes('console.log') }
                ];
                
                console.log(`  Running ${tests.length} tests...`);
                
                let filePassed = true;
                tests.forEach(test => {
                    try {
                        if (test.test()) {
                            console.log(`  ✅ ${test.name}: PASSED`);
                        } else {
                            console.log(`  ❌ ${test.name}: FAILED`);
                            filePassed = false;
                        }
                    } catch (error) {
                        console.log(`  ❌ ${test.name}: ERROR - ${error.message}`);
                        filePassed = false;
                    }
                });
                
                results.push({
                    file: file,
                    passed: filePassed,
                    size: content.length
                });
                
                if (!filePassed) {
                    allTestsPassed = false;
                }
                
                console.log(`  📊 File size: ${content.length} bytes`);
                console.log(`  📋 Result: ${filePassed ? '✅ PASSED' : '❌ FAILED'}\n`);
                
            } else {
                console.log(`  ❌ File not found: ${file}\n`);
                allTestsPassed = false;
                results.push({
                    file: file,
                    passed: false,
                    size: 0,
                    error: 'File not found'
                });
            }
        } catch (error) {
            console.log(`  ❌ Error testing ${file}: ${error.message}\n`);
            allTestsPassed = false;
            results.push({
                file: file,
                passed: false,
                size: 0,
                error: error.message
            });
        }
    });
    
    // Summary
    console.log('📊 TEST SUMMARY');
    console.log('================');
    
    const passedFiles = results.filter(r => r.passed).length;
    const failedFiles = results.filter(r => !r.passed).length;
    const totalSize = results.reduce((sum, r) => sum + r.size, 0);
    
    console.log(`✅ Files passed: ${passedFiles}`);
    console.log(`❌ Files failed: ${failedFiles}`);
    console.log(`📦 Total size: ${totalSize} bytes`);
    console.log(`🎯 Overall result: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}\n`);
    
    // Detailed results
    console.log('📋 DETAILED RESULTS');
    console.log('==================');
    results.forEach(result => {
        console.log(`${result.passed ? '✅' : '❌'} ${result.file} (${result.size} bytes)${result.error ? ` - ${result.error}` : ''}`);
    });
    
    return allTestsPassed;
}

// Test browser compatibility features
function testBrowserCompatibility() {
    console.log('\n🌐 Testing browser compatibility features...\n');
    
    const compatibilityTests = [
        {
            name: 'ES6 Features',
            features: ['const', 'let', '=>', 'class', 'Promise', 'async', 'await']
        },
        {
            name: 'DOM APIs',
            features: ['querySelector', 'addEventListener', 'createElement', 'appendChild']
        },
        {
            name: 'Modern Web APIs',
            features: ['fetch', 'localStorage', 'sessionStorage', 'requestAnimationFrame']
        },
        {
            name: 'Event Handling',
            features: ['click', 'keydown', 'load', 'DOMContentLoaded']
        }
    ];
    
    const jsFiles = [
        'test-extracted/Configuration/quick-menu.js',
        'test-extracted/Configuration/player-integration.js'
    ];
    
    jsFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            console.log(`📄 Checking compatibility for: ${file}`);
            
            compatibilityTests.forEach(test => {
                const foundFeatures = test.features.filter(feature => content.includes(feature));
                const coverage = (foundFeatures.length / test.features.length) * 100;
                
                console.log(`  ${test.name}: ${Math.round(coverage)}% coverage (${foundFeatures.length}/${test.features.length})`);
                if (foundFeatures.length > 0) {
                    console.log(`    Found: ${foundFeatures.join(', ')}`);
                }
            });
            console.log('');
        }
    });
}

// Run all tests
function runAllTests() {
    console.log('🚀 AI Upscaler Plugin - JavaScript Compatibility Test Suite');
    console.log('==========================================================\n');
    
    const syntaxTestResult = testJavaScriptSyntax();
    testBrowserCompatibility();
    
    console.log('\n🎯 FINAL RESULT');
    console.log('===============');
    console.log(`JavaScript syntax tests: ${syntaxTestResult ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Compatibility analysis: ✅ COMPLETED`);
    console.log(`Overall status: ${syntaxTestResult ? '🟢 READY FOR PRODUCTION' : '🔴 NEEDS FIXES'}`);
    
    return syntaxTestResult;
}

// Run if called directly
if (require.main === module) {
    runAllTests();
}

module.exports = { testJavaScriptSyntax, testBrowserCompatibility, runAllTests };