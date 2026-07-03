// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// Test-only helpers: standard base64 decoding (to verify tokenURI payloads
/// without ffi) and substring search.
library TestUtils {
    function base64Decode(string memory input) internal pure returns (bytes memory) {
        bytes memory data = bytes(input);
        require(data.length % 4 == 0, "bad base64 length");
        if (data.length == 0) return "";

        uint256 padding = 0;
        if (data[data.length - 1] == "=") padding++;
        if (data[data.length - 2] == "=") padding++;

        bytes memory out = new bytes((data.length / 4) * 3 - padding);
        uint256 outIdx = 0;
        for (uint256 i = 0; i < data.length; i += 4) {
            uint256 chunk = (_b64Value(data[i]) << 18) | (_b64Value(data[i + 1]) << 12)
                | (_b64Value(data[i + 2]) << 6) | _b64Value(data[i + 3]);
            out[outIdx++] = bytes1(uint8(chunk >> 16));
            if (outIdx < out.length) out[outIdx++] = bytes1(uint8(chunk >> 8));
            if (outIdx < out.length) out[outIdx++] = bytes1(uint8(chunk));
        }
        return out;
    }

    function _b64Value(bytes1 c) private pure returns (uint256) {
        uint8 v = uint8(c);
        if (v >= 65 && v <= 90) return v - 65; // A-Z
        if (v >= 97 && v <= 122) return v - 71; // a-z
        if (v >= 48 && v <= 57) return v + 4; // 0-9
        if (c == "+") return 62;
        if (c == "/") return 63;
        if (c == "=") return 0;
        revert("bad base64 char");
    }

    function contains(string memory haystack, string memory needle) internal pure returns (bool) {
        bytes memory h = bytes(haystack);
        bytes memory n = bytes(needle);
        if (n.length == 0) return true;
        if (n.length > h.length) return false;
        for (uint256 i = 0; i <= h.length - n.length; i++) {
            bool ok = true;
            for (uint256 j = 0; j < n.length; j++) {
                if (h[i + j] != n[j]) {
                    ok = false;
                    break;
                }
            }
            if (ok) return true;
        }
        return false;
    }

    function startsWith(string memory s, string memory prefix) internal pure returns (bool) {
        bytes memory b = bytes(s);
        bytes memory p = bytes(prefix);
        if (p.length > b.length) return false;
        for (uint256 i = 0; i < p.length; i++) {
            if (b[i] != p[i]) return false;
        }
        return true;
    }

    function slice(string memory s, uint256 start) internal pure returns (string memory) {
        bytes memory b = bytes(s);
        bytes memory out = new bytes(b.length - start);
        for (uint256 i = start; i < b.length; i++) {
            out[i - start] = b[i];
        }
        return string(out);
    }
}
