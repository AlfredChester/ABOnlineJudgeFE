 /**
 * @file        high-precision.h
 * @author      Dr.Alfred (fredbao1126@gmail.com)
 * @brief       high precision number header
 * @version     0.6 Beta
 * @date        2022-10-23
 * 
 * @copyright   Copyright (c) 2019-2023 <Rhodes Island Inc.>
 * @license:    MIT License
 */

// TODO Improve multiplication performance using FFT
// TODO Improve division and mod efficient

/*
 * INCLUDE: cpp bases libs
 */

#include <deque>        // _hp_base_MetaTp support
#include <stdio.h>      // c style base I/O support
#include <iostream>     // cpp I/O stream support & _init_string_T

/**
 * Marco Definations
 */

#ifndef _HIGH_PRECISION_MARCO_
    #define _HIGH_PRECISION_MARCO_
    // Configurations
    #define  ALLOW_LEADING_ZERO     false   // Allow Leading zero
    #define  AUTO_FLOOR             true    // Auto floor for division
    #define  DEBUG_MODE             false   // Print runtime logs
    #define  DEFAULT_INIT_ZERO      true    // Defaults to 0 for highInt objects
    #define  ENABLE_FFT             false   // Experimental FFT multiplication
    #define  HP_ALLOW_WARNING       true    // Warning when invalid stuff occur
    #define  REDUCE_SPACE           true    // Reduce space by assigning _deque_vTp to char
    // Pre Marco Define useful constants
    #define  __high0                highInt(0)
    #define  __high10               highInt(10)
#endif // !_HIGH_PRECISION_MARCO_

/**
 *  Additional includes
 */

#if ENABLE_FFT
    #include "fft-mult-extension.h" // FFT extension
#endif

/**
 * Type Definations
 */

#ifndef _HIGH_PRECISION_TYPES_
    #define _HIGH_PRECISION_TYPES_  /* NOTHING */
    #if REDUCE_SPACE
        // Assign to char to reduce space (or short)
        typedef char                _deque_vTp;
    #else
        typedef int                 _deque_vTp;
    #endif // !REDUCE_SPACE
    typedef long long               _base_iter_Tp;
    typedef std::string             _init_string_T;
    typedef std::deque<_deque_vTp>  _hp_base_MetaTp;
#endif // !_HIGH_PRECISION_TYPES_

#ifndef _HIGH_PRECISION_H_
#define _HIGH_PRECISION_H_  /* NOTHING */

struct highInt {
    private:
        _hp_base_MetaTp __metadata;
        bool            isNeg;
        
        /**
         * @brief Process leading zeros
         */
        inline void _processLeadingZeros(void) {
            int delCnt = 0; // delete count
            while (__metadata.size() > 1ULL && (!__metadata[0]) && (!ALLOW_LEADING_ZERO)) {
                __metadata.pop_front();
                if (DEBUG_MODE) {
                    ++delCnt;
                }
            }
            if (DEBUG_MODE) {
                printf("Deleted leading zeros * %d\n", delCnt);
            }
        }

        /**
         * @brief check if self is -0
         */
        inline void checkNeg0(void) {
            _processLeadingZeros(); // may be -0000000
            if (isNeg && __metadata.size() == 1ULL && __metadata[0] == 0) {
                isNeg = false;
            }
        }

        /**
         * @brief Handle Digit Carry
         */
        inline void _handleCarry(void) {
            if (__metadata.front() < 0) {   // *this is a negative number
                isNeg = true;               // set negative to true
                for (size_t i = 0; i < __metadata.size(); i++) {
                    __metadata[i] = -__metadata[i];
                }
            }
            for (_base_iter_Tp i = __metadata.size() - 1; i >= 0; i--) {
                if (i == 0) {
                    __metadata.push_front(__metadata[i] / 10);
                    __metadata[1] %= 10;
                }
                else {
                    __metadata[i - 1] += __metadata[i] / 10;
                    __metadata[i] %= 10;
                }
            }
            for (_base_iter_Tp i = __metadata.size() - 1; i > 0; i--) {
                if (__metadata[i] < 0) {
                    while (__metadata[i] < 0) {
                        __metadata[i] += 10;
                        __metadata[i - 1] -= 1;
                    }
                }
            }
            if (DEBUG_MODE) {
                printf("_M_Data After handleCarry: ");
                for (auto ele : __metadata) {
                    printf("%d ", ele);
                }
                putchar('\n');
            }
            checkNeg0();
        }

    public:
        /**
         * @brief Construct a new high Int object
         */
        highInt() {
            isNeg = false;
            __metadata.clear();
            if (DEFAULT_INIT_ZERO) {
                __metadata.push_back(0);
            }
        }

        /**
         * @brief Construct a new high Int object by string
         * 
         * @param __init Init string
         */
        highInt(_init_string_T __init) {
            bool invalid = false;
            if (__init.empty()) {
                invalid = true;
                goto print_invalid;
            }
            __metadata.clear(), isNeg = __init[0] == '-';
            if ((!isNeg) && (!isdigit(__init[0]))) {
                invalid = true;
                goto print_invalid;
            }
            for (size_t _i = isNeg ? 1 : 0; _i < __init.size(); _i++) {
                if (!isdigit(__init[_i])) {
                    invalid = true;
                    goto print_invalid;
                }
                __metadata.push_back(__init[_i] - '0');
            }
            _processLeadingZeros(), checkNeg0();
            print_invalid:
            if (HP_ALLOW_WARNING && invalid) {
                printf("Warning: invalid std::string argument is given to highInt constructor\n");
                printf("Argument data: %s\n", __init.c_str());
            }
        }

        /**
         * @brief Construct a new high Int object
         * 
         * @param __init init number
         */
        highInt(long long __init) {
            if (DEBUG_MODE) {
                printf("Using HighInt Construction func, input is %lld\n", __init);
            }
            __metadata.clear(), isNeg = false;
            if (__init == 0) {
                __metadata.push_back(0);
            }   // Bug No1
            if (__init < 0) {
                isNeg  = true, __init = -__init;
            }
            while (__init) {
                __metadata.push_front(__init % 10);
                __init /= 10;
            }
            _processLeadingZeros(), checkNeg0();
        }

        /**
         * @brief Construct a new high Int object (usually by struct inside codes)
         *
         * @param _neg is negative
         * @param __init init array
         */
        highInt (bool _neg, _hp_base_MetaTp &__init) {
            isNeg = _neg, __metadata = __init;
            _handleCarry(), _processLeadingZeros(), checkNeg0();
        }

        /**
         * @brief Get metadata
         * 
         * @return _hp_base_MetaTp 
         */
        inline _hp_base_MetaTp _get_M_data(void) {
            return __metadata;
        }

        /**
         * @brief Input the item (based on getchar), signed
         */
        inline void scan(void) {
            char _readCache;
            isNeg = false, __metadata.clear();
            while (!isdigit(_readCache = getchar())) {
                if (_readCache == '-') {
                    isNeg = true;
                }
            }
            __metadata.push_back(_readCache - '0');
            while (isdigit(_readCache = getchar())) {
                __metadata.push_back(_readCache - '0');
            }
            _processLeadingZeros(), checkNeg0();
        }

        /**
         * @brief Print the item
         */
        inline void print(void) const {
            if (isNeg) {
                putchar('-');
            }
            for (auto element : __metadata) {
                putchar(element + '0');
            }
        }

        /**
         * @brief check if it is negative;
         *
         * @return true
         * @return false
         */
        inline bool isNegative(void) {
            return isNeg;
        }

        /**
         * @brief Check if two highInt objects are equal
         * 
         * @param _ano another highInt obj
         * @return true equal
         * @return false unequal
         */
        inline bool operator==(highInt _ano) const {
            return _ano.isNegative() == isNeg && _ano._get_M_data() == __metadata;
        }

        /**
         * @brief *this is bigger than _ano
         * 
         * @param _ano another highInt obj
         * @return true bigger
         * @return false smaller/equal
         */
        inline bool operator>(highInt _ano) const {
            if (isNeg != _ano.isNegative()) {
                return !isNeg;
            }
            _hp_base_MetaTp __tmp = _ano._get_M_data();
            if (__metadata.size() != __tmp.size()) {
                return __metadata.size() > __tmp.size();
            }
            for (size_t i = 0; i < __metadata.size(); i++) {
                if (__metadata[i] != __tmp[i]) {
                    return __metadata[i] > __tmp[i];
                }
            }
            return false;
        }

        /**
         * @brief *this is smaller than _ano
         * 
         * @param _ano another highInt obj
         * @return true smaller
         * @return false bigger/equal
         */
        inline bool operator<(highInt _ano) const {
            if (isNeg != _ano.isNegative()) {
                return isNeg;
            }
            _hp_base_MetaTp __tmp = _ano._get_M_data();
            if (__metadata.size() != __tmp.size()) {
                return __metadata.size() < __tmp.size();
            }
            for (size_t i = 0; i < __metadata.size(); i++) {
                if (__metadata[i] != __tmp[i]) {
                    return __metadata[i] < __tmp[i];
                }
            }
            return false;
        }

        /**
         * @brief *this is smaller than _ano or is same as _ano
         * 
         * @param _ano another highInt obj
         * @return true smaller/equal
         * @return false bigger
         */
        inline bool operator<=(highInt _ano) const {
            if (isNeg != _ano.isNegative()) {
                return isNeg;
            }
            _hp_base_MetaTp __tmp = _ano._get_M_data();
            if (__metadata.size() != __tmp.size()) {
                return __metadata.size() < __tmp.size();
            }
            for (size_t i = 0; i < __metadata.size(); i++) {
                if (__metadata[i] != __tmp[i]) {
                    return __metadata[i] < __tmp[i];
                }
            }
            return true;
        }

        /**
         * @brief Transfer the item to integer
         * 
         * @return int value
         */
        inline int toInt(void) {
            int __retval = 0;
            if (HP_ALLOW_WARNING && __metadata.size() > 9ULL) {
                puts("Warning: using toInt function but int will overflow! toLongLong or toString is recommended");
            }
            for (auto element : __metadata) {
                __retval = __retval * 10 + element;
            }
            return isNeg ? -__retval : __retval;
        }

        /**
         * @brief Transfer the item to long long
         * 
         * @return long long value
         */
        inline long long toLongLong(void) {
            long long __retval = 0;
            if (HP_ALLOW_WARNING && __metadata.size() > 18ULL) {
                puts("Warning: using toLongLong function but long long will overflow!");
                puts("Using highInt only is suggested or you can use toString");
            }
            for (auto element : __metadata) {
                __retval = __retval * 10 + element;
            }
            return __retval * (isNeg ? -1 : 1);
        }

        /**
         * @brief Transfer the item to string
         * 
         * @return std::string value
         */
        inline std::string toString(void) {
            std::string __retval;
            if (isNeg) {
                __retval = "-";
            }
            for (auto digit : __metadata) {
                __retval += digit + '0';
            }
            return __retval;
        }

        /**
         * @brief Add two highInt objects
         * 
         * @param _ano another highInt
         * @return const highInt 
         */
        inline const highInt operator+(highInt _ano) const {
            // 倒叙相加
            if (DEBUG_MODE) {
                printf("Self: "), print();
                printf("\nOther: "), _ano.print();
                putchar('\n');
            }
            _hp_base_MetaTp __tmp, _ano_M_data = _ano._get_M_data();
            _base_iter_Tp it1 = __metadata.size() - 1;
            _base_iter_Tp it2 = _ano_M_data.size() - 1;
            int digit1, digit2;
            while (it1 >= 0 && it2 >= 0) {
                digit1 = isNeg ? -__metadata[it1] : __metadata[it1];
                digit2 = _ano.isNegative() ? -_ano_M_data[it2] : _ano_M_data[it2];
                __tmp.push_front(digit1 + digit2);
                --it1, --it2;
            }
            while (it1 >= 0) {
                digit1 = isNeg ? -__metadata[it1] : __metadata[it1];
                __tmp.push_front(digit1);
                --it1;
            }
            while (it2 >= 0) {
                digit2 = _ano.isNegative() ? -_ano_M_data[it2] : _ano_M_data[it2];
                __tmp.push_front(digit2);
                --it2;
            }
            // 进位, 退位放到了handleCarry函数中
            if (DEBUG_MODE) {
                printf("Added Src: ");
                for (auto ele : __tmp) {
                    printf("%d ", ele);
                }
                putchar('\n');
            }
            return highInt(false, __tmp);
        }

        /**
         * @brief Minus two highInt Objects
         * 
         * @param _ano another HighInt
         * @return const highInt 
         */
        inline const highInt operator-(highInt _ano) const {
            // 倒叙相减(沿用加法代码)
            _hp_base_MetaTp __tmp, _ano_M_data = _ano._get_M_data();
            _base_iter_Tp it1 = __metadata.size() - 1;
            _base_iter_Tp it2 = _ano_M_data.size() - 1;
            int digit1, digit2;
            while (it1 >= 0 && it2 >= 0) {
                digit1 = isNeg ? -__metadata[it1] : __metadata[it1];
                digit2 = _ano.isNegative() ? _ano_M_data[it2] : -_ano_M_data[it2];
                __tmp.push_front(digit1 + digit2);
                --it1, --it2;
            }
            while (it1 >= 0) {
                digit1 = isNeg ? -__metadata[it1] : __metadata[it1];
                __tmp.push_front(digit1);
                --it1;
            }
            while (it2 >= 0) {
                digit2 = _ano.isNegative() ? _ano_M_data[it2] : -_ano_M_data[it2];
                __tmp.push_front(digit2);
                --it2;
            }
            // 进位, 退位放到了handleCarry函数中
            if (DEBUG_MODE) {
                printf("Added Src: ");
                for (auto ele : __tmp) {
                    printf("%d ", ele);
                }
                putchar('\n');
            }
            return highInt(false, __tmp);
        }

        /**
         * @brief Multiplies Two highInt Objects
         * 
         * @param _ano another HighInt
         * @return const highInt 
         */
        inline const highInt operator*(highInt _ano) const {
            #if ENABLE_FFT
                // 对绝对值部分进行FFT, 符号直接返回
                _hp_base_MetaTp result = FFT_Extension::fft_mult_api(
                    __metadata, _ano._get_M_data()
                );
                return highInt(isNeg ^ _ano.isNegative(), result);
            #else
                _hp_base_MetaTp __tmp, _ano_M_data = _ano._get_M_data();
                bool _isNeg = isNeg ^ _ano.isNegative();
                // reserve spaces
                __tmp.resize(__metadata.size() + _ano_M_data.size() - 1, 0);
                // 绝对值相乘
                for (_base_iter_Tp j = _ano_M_data.size() - 1; j >= 0; j--) {
                    if (!_ano_M_data[j]) {
                        continue;
                    }
                    for (size_t i = 0; i < __metadata.size(); i++) {
                        __tmp[i + j] += _ano_M_data[j] * __metadata[i];
                    }
                }
                return highInt(_isNeg, __tmp);
            #endif
        }

        /**
         * @brief division between two highInts
         * 
         * @param _ano another highInt
         * @return const highInt 
         */
        inline const highInt operator/(highInt _ano) const {
            if ((*this) == 0) {
                return highInt(0);
            }
            bool _isNeg = isNeg ^ _ano.isNegative();
            // 绝对值相除
            highInt now = 0, ans;
            long long cnt = 0;
            for (size_t i = 0; i < __metadata.size(); i++) {
                now = now * __high10 + __metadata[i];
                cnt = 0;
                // cnt * _ano <= now
                while (_ano <= now) {
                    ++cnt;
                    now = now - _ano;
                }
                // printf("%lld * %lld = %lld\n", cnt, _aLL, now.toLongLong());
                ans = ans * __high10 + cnt;
            }
            if ((AUTO_FLOOR) && (now * 2 > ans)) {
                ans = ans + 1;
            }
            return ans * (_isNeg ? -1 : 1);
        }

        /**
         * @brief Mods
         * 
         * @param _ano another highInt object
         * @return const highInt 
         */
        inline const highInt operator%(highInt _ano) const {
            if ((*this) == 0) {
                return highInt(0);
            }
            // 绝对值相除
            highInt now = 0, ans;
            long long cnt = 0;
            for (size_t i = 0; i < __metadata.size(); i++) {
                now = now * 10 + __metadata[i];
                cnt = 0;
                while (_ano <= now) {
                    ++cnt;
                    now = now - _ano;
                }
                ans = ans * 10 + cnt;
            }
            return now;
        }
};

inline highInt operator+(long long _left, highInt _right) {
    return highInt(_left) + _right;
}

inline highInt operator-(long long _left, highInt _right) {
    return highInt(_left) - _right;
}

inline highInt operator*(long long _left, highInt _right) {
    return highInt(_left) * _right;
}

inline highInt operator/(long long _left, highInt _right) {
    return highInt(_left) / _right;
}

inline highInt operator%(long long _left, highInt _right) {
    return highInt(_left) % _right;
}

inline highInt scanHighInt() {
    char _readCache;
    bool isNeg = false;
    _hp_base_MetaTp __metadata;
    __metadata.clear();
    while (!isdigit(_readCache = getchar())) {
        if (_readCache == '-') {
            isNeg = true;
        }
    }
    __metadata.push_back(_readCache - '0');
    while (isdigit(_readCache = getchar())) {
        __metadata.push_back(_readCache - '0');
    }
    return highInt(isNeg, __metadata);
}

inline void scanHighInt(highInt &_src) {
    char _readCache;
    bool isNeg = false;
    _hp_base_MetaTp __metadata;
    __metadata.clear();
    while (!isdigit(_readCache = getchar())) {
        if (_readCache == '-') {
            isNeg = true;
        }
    }
    __metadata.push_back(_readCache - '0');
    while (isdigit(_readCache = getchar())) {
        __metadata.push_back(_readCache - '0');
    }
    _src = highInt(isNeg, __metadata);
}

inline highInt abs(highInt _a) {
    _hp_base_MetaTp _t = _a._get_M_data();
    return highInt(false, _t);
}

inline highInt gcd(highInt _a, highInt _b) {
    return (_b == __high0) ? _a : gcd(_b, _a % _b);
}

inline highInt lcm(highInt a, highInt b) {
    return a / gcd(a, b) * b;
}

inline std::istream &operator>>(std::istream &in, highInt &num) {
    _init_string_T str;
    if (!(in >> str)) {
        return in;
    }
    num = str;
    return in;
}

inline std::ostream &operator<<(std::ostream &out, highInt num) {
    if (num.isNegative()) {
        out << '-';
    }
    for (auto digit : num._get_M_data()) {
        if (REDUCE_SPACE) {
            out << (char)(digit + '0');
        }
        else {
            out << digit;
        }
    }
    return out;
}
#endif // !_HIGH_PRECISION_H_   
