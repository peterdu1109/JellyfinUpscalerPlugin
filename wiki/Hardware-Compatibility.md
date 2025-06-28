# 🎯 Hardware Compatibility

Complete hardware compatibility guide for JellyfinUpscalerPlugin v1.3.5.

---

## 🖥️ **Supported Graphics Cards**

### 🟢 **NVIDIA - Full AV1 Support**
| Series | Models | AV1 Decode | AV1 Encode | DLSS | Performance |
|--------|---------|------------|------------|------|-------------|
| **RTX 40 Series** | 4060-4090 | ✅ Hardware | ✅ Hardware | 3.0 | Excellent |
| **RTX 30 Series** | 3060-3090 Ti | ✅ Hardware | ❌ Software | 2.0 | Very Good |
| **RTX 20 Series** | 2060-2080 Ti | ❌ Software | ❌ Software | 2.0 | Good |
| **GTX 16 Series** | 1660-1660 Ti | ❌ Software | ❌ Software | ❌ | Fair |
| **GTX 10 Series** | 1050-1080 Ti | ❌ Software | ❌ Software | ❌ | Fair |

### 🔴 **AMD - Selective AV1 Support**
| Series | Models | AV1 Decode | AV1 Encode | FSR | Performance |
|--------|---------|------------|------------|-----|-------------|
| **RX 7000 Series** | 7600-7900 XTX | ✅ Hardware | ✅ Hardware | 3.0 | Excellent |
| **RX 6000 Series** | 6600-6950 XT | ❌ Software | ❌ Software | 2.0 | Very Good |
| **RX 5000 Series** | 5500-5700 XT | ❌ Software | ❌ Software | 1.0 | Good |
| **RX 500 Series** | 570-590 | ❌ Software | ❌ Software | 1.0 | Fair |

### ⚡ **Intel - Modern AV1 Support**
| Series | Models | AV1 Decode | AV1 Encode | XeSS | Performance |
|--------|---------|------------|------------|------|-------------|
| **Arc Series** | A380, A750, A770 | ✅ Hardware | ✅ Hardware | ✅ | Very Good |
| **UHD 770** | 12th Gen+ | ✅ Hardware | ❌ Software | ❌ | Good |
| **UHD 750** | 11th Gen | ❌ Software | ❌ Software | ❌ | Fair |
| **UHD 630** | 8th-10th Gen | ❌ Software | ❌ Software | ❌ | Fair |

### 🍎 **Apple Silicon - Native Support**
| Chip | Models | AV1 Decode | Metal | Performance |
|------|---------|------------|-------|-------------|
| **M3 Series** | M3, M3 Pro, M3 Max | ✅ Hardware | ✅ | Excellent |
| **M2 Series** | M2, M2 Pro, M2 Max | ✅ Hardware | ✅ | Very Good |
| **M1 Series** | M1, M1 Pro, M1 Max | ✅ Hardware | ✅ | Good |

---

## 💻 **System Requirements**

### 🎯 **Minimum Requirements**
- **OS:** Windows 10 (1903+), macOS 10.15+, Ubuntu 20.04+
- **CPU:** Intel i5-8400 / AMD Ryzen 5 2600
- **RAM:** 8GB System Memory
- **GPU:** GTX 1060 / RX 580 / UHD 630
- **Storage:** 2GB free space

### 🚀 **Recommended for 4K**
- **CPU:** Intel i7-10700K / AMD Ryzen 7 3700X
- **RAM:** 16GB System + 6GB VRAM
- **GPU:** RTX 3070 / RX 6700 XT / Arc A750
- **Storage:** 4GB SSD space

### 🎮 **Optimal for 8K**
- **CPU:** Intel i9-12900K / AMD Ryzen 9 5900X
- **RAM:** 32GB System + 12GB VRAM
- **GPU:** RTX 4080 / RX 7800 XT / Arc A770
- **Storage:** 8GB NVMe SSD

---

## 📋 **Compatibility Matrix**

### ✅ **Fully Compatible**
- All features work flawlessly
- Hardware acceleration available
- Real-time processing supported

### ⚡ **Light Mode Compatible**
- Basic features available
- Software processing only
- Reduced quality options

### ❌ **Not Compatible**
- Hardware too old/weak
- Missing driver support
- Incompatible architecture

---

*For detailed setup instructions, see [Installation Guide](Installation)*