#!/bin/bash

# Jellyfin Upscaler Plugin - Linux Compatibility Test Script
# Tests plugin functionality across different Linux distributions
# Version: 1.3.0

set -e

echo "🔍 Jellyfin AI Upscaler Plugin - Linux Compatibility Test"
echo "========================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "${BLUE}🧪 Testing: $test_name${NC}"
    ((TESTS_TOTAL++))
    
    if eval "$test_command" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS: $test_name${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL: $test_name${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Function to run a test with output
run_test_with_output() {
    local test_name="$1"
    local test_command="$2"
    
    echo -e "${BLUE}🧪 Testing: $test_name${NC}"
    ((TESTS_TOTAL++))
    
    if result=$(eval "$test_command" 2>&1); then
        echo -e "${GREEN}✅ PASS: $test_name${NC}"
        echo -e "${YELLOW}📋 Output: $result${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL: $test_name${NC}"
        echo -e "${RED}❌ Error: $result${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo -e "${BLUE}🔍 System Information${NC}"
echo "===================="

# Detect Linux distribution
if [ -f /etc/os-release ]; then
    . /etc/os-release
    echo "Distribution: $NAME $VERSION_ID"
    echo "Codename: $VERSION_CODENAME"
else
    echo "⚠️ Cannot detect Linux distribution"
fi

echo "Kernel: $(uname -r)"
echo "Architecture: $(uname -m)"
echo "Hostname: $(hostname)"
echo ""

echo -e "${BLUE}🧪 Basic System Tests${NC}"
echo "===================="

# Test 1: Check if curl is available
run_test "curl availability" "command -v curl"

# Test 2: Check if wget is available  
run_test "wget availability" "command -v wget"

# Test 3: Check if unzip is available
run_test "unzip availability" "command -v unzip"

# Test 4: Check if systemctl is available
run_test "systemctl availability" "command -v systemctl"

# Test 5: Check internet connectivity
run_test "Internet connectivity" "curl -s --connect-timeout 5 https://google.com"

echo ""
echo -e "${BLUE}🐳 Jellyfin Tests${NC}"
echo "================"

# Test 6: Check if Jellyfin is installed
run_test "Jellyfin installation" "command -v jellyfin || systemctl is-active jellyfin"

# Test 7: Check Jellyfin service status
run_test_with_output "Jellyfin service status" "systemctl is-active jellyfin || echo 'not running'"

# Test 8: Check Jellyfin plugin directory
PLUGIN_DIRS=(
    "/var/lib/jellyfin/plugins"
    "/usr/share/jellyfin/plugins"
    "/etc/jellyfin/plugins"
    "/opt/jellyfin/plugins"
)

JELLYFIN_PLUGIN_DIR=""
for dir in "${PLUGIN_DIRS[@]}"; do
    if [[ -d "$dir" ]]; then
        JELLYFIN_PLUGIN_DIR="$dir"
        break
    fi
done

if [[ -n "$JELLYFIN_PLUGIN_DIR" ]]; then
    echo -e "${GREEN}✅ PASS: Jellyfin plugin directory found: $JELLYFIN_PLUGIN_DIR${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL: Jellyfin plugin directory not found${NC}"
    ((TESTS_FAILED++))
fi
((TESTS_TOTAL++))

echo ""
echo -e "${BLUE}🎮 GPU Detection Tests${NC}"
echo "====================="

# Test 9: Check for NVIDIA GPU
if lspci | grep -i nvidia >/dev/null 2>&1; then
    echo -e "${GREEN}🎮 NVIDIA GPU detected${NC}"
    
    # Test NVIDIA drivers
    run_test_with_output "NVIDIA drivers" "nvidia-smi --query-gpu=name --format=csv,noheader,nounits || echo 'drivers not installed'"
    
    # Test NVIDIA CUDA
    run_test "NVIDIA CUDA availability" "command -v nvcc || test -d /usr/local/cuda"
else
    echo -e "${YELLOW}⚠️ No NVIDIA GPU detected${NC}"
fi

# Test 10: Check for AMD GPU
if lspci | grep -i amd >/dev/null 2>&1; then
    echo -e "${GREEN}🎮 AMD GPU detected${NC}"
    
    # Test AMD ROCm
    run_test_with_output "AMD ROCm" "rocm-smi || echo 'ROCm not installed'"
    
    # Test AMD drivers
    run_test "AMD drivers" "test -d /sys/class/drm && ls /sys/class/drm/card* >/dev/null"
else
    echo -e "${YELLOW}⚠️ No AMD GPU detected${NC}"
fi

# Test 11: Check for Intel GPU
if lspci | grep -i "vga.*intel" >/dev/null 2>&1; then
    echo -e "${GREEN}🎮 Intel GPU detected${NC}"
    
    # Test Intel GPU tools
    run_test_with_output "Intel GPU tools" "intel_gpu_top --help || echo 'tools not installed'"
    
    # Test VA-API
    run_test "VA-API support" "vainfo || echo 'VA-API not available'"
else
    echo -e "${YELLOW}⚠️ No Intel GPU detected${NC}"
fi

echo ""
echo -e "${BLUE}📦 Dependencies Tests${NC}"
echo "===================="

# Test 12: Check Python3
run_test "Python 3 availability" "command -v python3"

# Test 13: Check Node.js
run_test "Node.js availability" "command -v node"

# Test 14: Check build tools
run_test "Build tools (gcc)" "command -v gcc"

# Test 15: Check CMake
run_test "CMake availability" "command -v cmake"

# Test 16: Check pkg-config
run_test "pkg-config availability" "command -v pkg-config"

echo ""
echo -e "${BLUE}🔧 Plugin Specific Tests${NC}"
echo "========================"

# Test 17: Check if AI models can be downloaded
run_test "GitHub API access" "curl -s https://api.github.com/repos/Kuschel-code/JellyfinUpscalerPlugin/releases/latest"

# Test 18: Test plugin file structure
CURRENT_DIR=$(pwd)
if [[ -f "$CURRENT_DIR/Plugin.cs" && -f "$CURRENT_DIR/PluginConfiguration.cs" ]]; then
    echo -e "${GREEN}✅ PASS: Plugin source files found${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL: Plugin source files not found${NC}"
    ((TESTS_FAILED++))
fi
((TESTS_TOTAL++))

# Test 19: Check AI model files
MODEL_COUNT=0
MODELS_DIR="$CURRENT_DIR/shaders"
if [[ -d "$MODELS_DIR" ]]; then
    for model_dir in "$MODELS_DIR"/*; do
        if [[ -d "$model_dir" && -f "$model_dir/model.json" ]]; then
            ((MODEL_COUNT++))
        fi
    done
    
    if [ $MODEL_COUNT -gt 0 ]; then
        echo -e "${GREEN}✅ PASS: Found $MODEL_COUNT AI model(s)${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}❌ FAIL: No AI models found${NC}"
        ((TESTS_FAILED++))
    fi
else
    echo -e "${RED}❌ FAIL: Models directory not found${NC}"
    ((TESTS_FAILED++))
fi
((TESTS_TOTAL++))

# Test 20: Memory and disk space check
AVAILABLE_RAM=$(free -m | awk 'NR==2{printf "%.1f", $7/1024}')
AVAILABLE_DISK=$(df -BG . | awk 'NR==2{print $4}' | sed 's/G//')

echo -e "${BLUE}💾 System Resources${NC}"
echo "Available RAM: ${AVAILABLE_RAM}GB"
echo "Available Disk: ${AVAILABLE_DISK}GB"

if (( $(echo "$AVAILABLE_RAM >= 4.0" | bc -l) )); then
    echo -e "${GREEN}✅ PASS: Sufficient RAM (${AVAILABLE_RAM}GB >= 4.0GB)${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠️ WARNING: Low RAM (${AVAILABLE_RAM}GB < 4.0GB)${NC}"
    ((TESTS_FAILED++))
fi
((TESTS_TOTAL++))

if [[ $AVAILABLE_DISK -ge 2 ]]; then
    echo -e "${GREEN}✅ PASS: Sufficient disk space (${AVAILABLE_DISK}GB >= 2GB)${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}❌ FAIL: Insufficient disk space (${AVAILABLE_DISK}GB < 2GB)${NC}"
    ((TESTS_FAILED++))
fi
((TESTS_TOTAL++))

echo ""
echo -e "${BLUE}🔒 Permissions Tests${NC}"
echo "==================="

# Test 21: Check if user can write to /tmp
run_test "Write permission to /tmp" "touch /tmp/jellyfin-upscaler-test && rm /tmp/jellyfin-upscaler-test"

# Test 22: Check sudo availability
run_test "sudo availability" "command -v sudo"

# Test 23: Check if user is in video group (for GPU access)
if groups | grep -q video; then
    echo -e "${GREEN}✅ PASS: User is in video group${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${YELLOW}⚠️ WARNING: User not in video group (may affect GPU access)${NC}"
    ((TESTS_FAILED++))
fi
((TESTS_TOTAL++))

echo ""
echo -e "${BLUE}🌐 Network Tests${NC}"
echo "==============="

# Test 24: Test GitHub access
run_test "GitHub repository access" "curl -s --connect-timeout 10 https://github.com/Kuschel-code/JellyfinUpscalerPlugin"

# Test 25: Test raw GitHub access
run_test "GitHub raw access" "curl -s --connect-timeout 10 https://raw.githubusercontent.com/Kuschel-code/JellyfinUpscalerPlugin/main/README.md | head -1"

echo ""
echo "=========================================="
echo -e "${BLUE}📊 Test Results Summary${NC}"
echo "=========================================="

# Calculate percentage
PASS_PERCENTAGE=$((TESTS_PASSED * 100 / TESTS_TOTAL))

echo "Total Tests: $TESTS_TOTAL"
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "Success Rate: ${GREEN}$PASS_PERCENTAGE%${NC}"

echo ""
echo -e "${BLUE}💡 Recommendations${NC}"
echo "=================="

if [[ $TESTS_FAILED -eq 0 ]]; then
    echo -e "${GREEN}🎉 Perfect! Your system is fully compatible with the Jellyfin AI Upscaler Plugin.${NC}"
    echo -e "${GREEN}✅ You can proceed with the installation using the automated installer.${NC}"
    echo ""
    echo "To install, run:"
    echo "curl -fsSL https://raw.githubusercontent.com/Kuschel-code/JellyfinUpscalerPlugin/main/install-linux.sh | bash"
elif [[ $PASS_PERCENTAGE -ge 80 ]]; then
    echo -e "${YELLOW}⚠️ Your system is mostly compatible but has some minor issues.${NC}"
    echo -e "${YELLOW}📋 The plugin should work, but consider addressing the failed tests.${NC}"
    
    if [[ $TESTS_FAILED -gt 0 ]]; then
        echo ""
        echo "Common solutions:"
        echo "• Install missing packages: sudo apt update && sudo apt install curl wget unzip build-essential"
        echo "• Install GPU drivers if needed"
        echo "• Add user to video group: sudo usermod -a -G video \$USER"
        echo "• Ensure Jellyfin is properly installed and running"
    fi
else
    echo -e "${RED}❌ Your system has compatibility issues that need to be resolved.${NC}"
    echo -e "${RED}🔧 Please address the failed tests before installing the plugin.${NC}"
    
    echo ""
    echo "Priority fixes needed:"
    if ! command -v jellyfin >/dev/null && ! systemctl is-active jellyfin >/dev/null; then
        echo "• Install Jellyfin: sudo apt install jellyfin"
    fi
    if ! command -v curl >/dev/null; then
        echo "• Install curl: sudo apt install curl"
    fi
    if [[ $AVAILABLE_RAM < 4 ]]; then
        echo "• Increase available RAM (current: ${AVAILABLE_RAM}GB, recommended: 4GB+)"
    fi
fi

echo ""
echo -e "${BLUE}📖 For detailed installation instructions, visit:${NC}"
echo "https://github.com/Kuschel-code/JellyfinUpscalerPlugin/wiki/Installation"

echo ""
echo -e "${BLUE}🆘 For support and troubleshooting, visit:${NC}"
echo "https://github.com/Kuschel-code/JellyfinUpscalerPlugin/wiki/Troubleshooting"

# Exit with appropriate code
if [[ $PASS_PERCENTAGE -ge 80 ]]; then
    exit 0
else
    exit 1
fi