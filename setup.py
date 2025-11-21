#!/usr/bin/env python3
"""
Quick setup script for the MLOps Dashboard
Checks dependencies and helps get you started quickly
"""

import subprocess
import sys
from pathlib import Path

def check_command(command, install_msg):
    """Check if a command is available"""
    try:
        subprocess.run([command, "--version"], capture_output=True, check=True)
        print(f"✓ {command} is installed")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print(f"✗ {command} is not installed")
        print(f"  {install_msg}")
        return False

def main():
    print("=" * 60)
    print("MLOps Dashboard Setup")
    print("=" * 60)
    print()
    
    # Check dependencies
    print("Checking dependencies...")
    node_ok = check_command("node", "Install from: https://nodejs.org/")
    npm_ok = check_command("npm", "Install Node.js to get npm")
    python_ok = check_command("python", "Install from: https://www.python.org/")
    
    if not all([node_ok, npm_ok, python_ok]):
        print("\n⚠ Please install missing dependencies and run this script again")
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("All dependencies found!")
    print("=" * 60)
    print()
    
    # Export metrics
    print("Step 1: Exporting metrics from MLflow...")
    q3_path = Path(__file__).parent / "Q3"
    try:
        result = subprocess.run(
            [sys.executable, "export_metrics.py"],
            cwd=q3_path,
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            print(result.stdout)
        else:
            print(f"⚠ Warning: {result.stderr}")
    except Exception as e:
        print(f"⚠ Could not export metrics: {e}")
    
    # Install npm packages
    print("\nStep 2: Installing frontend dependencies...")
    frontend_path = Path(__file__).parent / "frontend"
    try:
        subprocess.run(["npm", "install"], cwd=frontend_path, check=True)
        print("✓ Dependencies installed")
    except subprocess.CalledProcessError:
        print("✗ Failed to install dependencies")
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("Setup Complete! 🎉")
    print("=" * 60)
    print()
    print("To start the development server:")
    print("  cd frontend")
    print("  npm run dev")
    print()
    print("Then open: http://localhost:3000")
    print()
    print("To deploy to Vercel:")
    print("  npm i -g vercel")
    print("  cd frontend")
    print("  vercel")
    print("=" * 60)

if __name__ == "__main__":
    main()
