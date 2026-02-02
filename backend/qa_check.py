import urllib.request
import json
import sys

BASE_URL = "http://localhost:8000/api"

def request(method, endpoint, data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    encoded_data = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            body = response.read().decode()
            if not body:
                return response.status, None
            return response.status, json.loads(body)
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        try:
            return e.code, json.loads(body)
        except:
            return e.code, body
    except Exception as e:
        print(f"Error: {e}")
        return 500, str(e)

def run_checks():
    print("🚀 Starting QA Smoke Checks...")
    
    # 1. Register
    email = "qa_test_user@example.com"
    password = "qa_password_123"
    print(f"\n1. Testing Registration ({email})...")
    status, res = request("POST", "/auth/register", {
        "email": email,
        "password": password,
        "full_name": "QA Bot"
    })
    
    if status in [200, 201]:
        print("✅ Registration Successful")
    elif status == 400 and ("already exists" in str(res) or "Email exists" in str(res)):
        print("⚠️ User already exists (Skipping registration)")
    else:
        print(f"❌ Registration Failed: {status} {res}")
        sys.exit(1)

    # 2. Login
    print("\n2. Testing Login...")
    status, res = request("POST", "/auth/login", {
        "email": email,
        "password": password
    })
    
    if status == 200 and "access_token" in res:
        token = res["access_token"]
        print("✅ Login Successful")
    else:
        print(f"❌ Login Failed: {status} {res}")
        sys.exit(1)

    # 3. Create Task
    print("\n3. Testing Create Task...")
    task_title = "QA Auto Task"
    status, res = request("POST", "/todos/", {
        "title": task_title,
        "description": "Created by automated QA script"
    }, token)
    
    if status in [200, 201] and res["title"] == task_title:
        print("✅ Task Creation Successful")
        task_id = res["id"]
    else:
        print(f"❌ Task Creation Failed: {status} {res}")
        sys.exit(1)

    # 4. List Tasks
    print("\n4. Testing List Tasks...")
    status, res = request("GET", "/todos/", token=token)
    
    if status == 200 and isinstance(res, list):
         print(f"✅ List Tasks Successful (Found {len(res)} tasks)")
    else:
        print(f"❌ List Tasks Failed: {status} {res}")
        sys.exit(1)

    # 5. Delete Task (Cleanup)
    print(f"\n5. Cleaning up (Deleting Task {task_id})...")
    status, _ = request("DELETE", f"/todos/{task_id}", token=token)
    
    if status in [200, 204]:
        print("✅ Cleanup Successful")
    else:
        print(f"❌ Cleanup Failed: {status}")

    print("\n🎉 All QA Checks Passed!")

if __name__ == "__main__":
    run_checks()
