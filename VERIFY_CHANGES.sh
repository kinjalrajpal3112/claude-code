#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  CART FUNCTIONALITY VERIFICATION${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if we're on the right branch
echo -e "${YELLOW}1. Checking Git Branch...${NC}"
CURRENT_BRANCH=$(git branch --show-current)
EXPECTED_BRANCH="claude/apply-notepad-changes-Tv7cB"

if [ "$CURRENT_BRANCH" = "$EXPECTED_BRANCH" ]; then
    echo -e "${GREEN}✓ Correct branch: $CURRENT_BRANCH${NC}"
else
    echo -e "${RED}✗ WRONG BRANCH!${NC}"
    echo -e "${RED}  Current: $CURRENT_BRANCH${NC}"
    echo -e "${RED}  Expected: $EXPECTED_BRANCH${NC}"
    echo -e "${YELLOW}  Run: git checkout $EXPECTED_BRANCH${NC}"
    exit 1
fi
echo ""

# Check latest commit
echo -e "${YELLOW}2. Checking Latest Commit...${NC}"
LATEST_COMMIT=$(git log -1 --oneline)
echo -e "${BLUE}  $LATEST_COMMIT${NC}"
echo ""

# Check if api.ts has correct endpoint
echo -e "${YELLOW}3. Checking src/services/api.ts...${NC}"
if grep -q "/api/cart?MobileNo=" src/services/api.ts; then
    echo -e "${GREEN}✓ Cart endpoint is CORRECT: /api/cart${NC}"
else
    if grep -q "/api/bzwebsite/GetCartItems" src/services/api.ts; then
        echo -e "${RED}✗ WRONG endpoint found: /api/bzwebsite/GetCartItems${NC}"
        echo -e "${RED}  This needs to be changed to: /api/cart${NC}"
        exit 1
    else
        echo -e "${YELLOW}⚠ Could not find cart endpoint${NC}"
    fi
fi
echo ""

# Check if product page has handleAddToCart
echo -e "${YELLOW}4. Checking src/app/product/[id]/page.tsx...${NC}"
if grep -q "async function handleAddToCart" src/app/product/[id]/page.tsx; then
    echo -e "${GREEN}✓ handleAddToCart function EXISTS${NC}"
else
    echo -e "${RED}✗ handleAddToCart function NOT FOUND${NC}"
    exit 1
fi

if grep -q "onClick={handleAddToCart}" src/app/product/[id]/page.tsx; then
    echo -e "${GREEN}✓ Button is CONNECTED to handleAddToCart${NC}"
else
    echo -e "${RED}✗ Button is NOT connected to handleAddToCart${NC}"
    exit 1
fi

if grep -q "import Toast from '@/components/Toast'" src/app/product/[id]/page.tsx; then
    echo -e "${GREEN}✓ Toast component IMPORTED${NC}"
else
    echo -e "${RED}✗ Toast component NOT imported${NC}"
    exit 1
fi

if grep -q "<Toast" src/app/product/[id]/page.tsx; then
    echo -e "${GREEN}✓ Toast component RENDERED${NC}"
else
    echo -e "${RED}✗ Toast component NOT rendered${NC}"
    exit 1
fi
echo ""

# Check if cart API route exists
echo -e "${YELLOW}5. Checking Cart API Route...${NC}"
if [ -f "src/app/api/cart/route.ts" ]; then
    echo -e "${GREEN}✓ Cart API route EXISTS at src/app/api/cart/route.ts${NC}"
else
    echo -e "${RED}✗ Cart API route NOT FOUND${NC}"
    exit 1
fi
echo ""

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ ALL CHECKS PASSED!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. ${BLUE}npm install${NC} (if not done yet)"
echo -e "2. ${BLUE}npm run dev${NC} (start development server)"
echo -e "3. Open browser: ${BLUE}http://localhost:3000${NC}"
echo -e "4. Test the cart functionality"
echo ""
echo -e "${YELLOW}Testing Instructions:${NC}"
echo -e "- Login with your mobile number"
echo -e "- Go to any product detail page"
echo -e "- Click 'Add to Cart' button"
echo -e "- Check for success toast notification"
echo -e "- Go to /cart page to verify item was added"
echo ""
