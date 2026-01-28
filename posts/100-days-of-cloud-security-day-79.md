---
title: '100 Days of Cloud Security - Day 79: CICD Goat - Indirect Poisoned Pipeline Execution (PPE)'
date: '2026-01-28'
author: 'Venkata Pathuri'
excerpt: 'Day 79 of my cloud security journey - CICD Goat - Indirect Poisoned Pipeline Execution (PPE)'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 79: CICD Goat - Indirect Poisoned Pipeline Execution (PPE)

## Overview
Welcome back to Day 79 of our cloud security journey! Today, we delve into a fascinating yet critical aspect of CI/CD security—Indirect Poisoned Pipeline Execution (PPE). As we build on the foundational knowledge from Day 78, we will explore how an attacker can exploit seemingly harmless files within a CI/CD pipeline to exfiltrate sensitive information. This knowledge underscores the importance of securing all components in our development pipelines, even those that seem benign.

## Learning Objectives
By the end of today’s session, you will grasp the concept of Indirect Poisoned Pipeline Execution and understand how attackers can manipulate pipeline configurations using auxiliary files. You’ll master the techniques for injecting malicious commands into CI/CD workflows and learn practical remediation strategies to secure your own pipelines. This knowledge will not only empower you as a cloud security practitioner but also make you more vigilant in identifying potential weaknesses in your deployment processes.

## Deep Dive
### Understanding Indirect PPE
Indirect Poisoned Pipeline Execution occurs when an attacker exploits the trust placed in the source code and its dependencies by manipulating files that the CI/CD pipeline executes. Here’s how it typically unfolds:

1. **Trust in Source Code**: CI/CD pipelines inherently trust the source code they process, assuming it is safe. This trust can be exploited by modifying files that are less scrutinized.
   
2. **Execution of Commands**: Common commands like `make`, `npm install`, or `pytest` are run during the pipeline process. If an attacker can alter the behavior of these commands, they can execute malicious scripts.

3. **Poisoning the Pipeline**: The attacker modifies configuration files such as `Makefile`, which may be executed during the build process. For example, altering a `Makefile` to include malicious commands can lead to unauthorized access to environment variables containing sensitive information.

4. **Exfiltration of Secrets**: With access to a privileged execution environment, the malicious script can read sensitive variables and send them to an external server controlled by the attacker.

### Scenario Breakdown
In our challenge, we cannot modify the `Jenkinsfile`, but we do have the ability to change the `Makefile`. The CI/CD pipeline is configured to download source code, load secrets (like `${FLAG3}`), and run the `make` command. Here’s how we can exploit this:

**Payload in Makefile**:
```Makefile
whoami:
    echo "${FLAG}" | base64
```

**Execution Flow**:
1. **Trigger**: By committing the modified `Makefile`, we initiate the pipeline.
2. **Setup**: Jenkins processes the `Jenkinsfile`, injecting secrets like `${FLAG3}` into the environment.
3. **Execution**: The command `make` is executed, and it follows our new instruction to print the secret.
4. **Result**: The output appears in the build logs as a Base64 encoded string, which we can decode to reveal the flag.

### Current Best Practices
To mitigate the risk of Indirect PPE in a real-world environment, consider the following best practices:
1. **Restrict Secret Access**: Limit exposure of secrets to only the necessary components of your build process. Use tools like AWS Secrets Manager or HashiCorp Vault to manage secrets securely.
   
2. **Review Sensitive Files**: Implement "Code Owners" to require approval for changes to critical files such as `Makefile` and `package.json`. This additional layer of scrutiny can help catch potential vulnerabilities.

3. **Isolate Builds**: Run builds in secure, isolated environments or containers that minimize exposure to sensitive data and prevent unauthorized network access.

## Hands-On Practice
To solidify your understanding, let’s simulate this attack in a controlled environment:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YOUR_ORG/Wonderland.git
   cd Wonderland
   ```

2. **Modify the Makefile**:
   Add the following malicious command:
   ```Makefile
   whoami:
       echo "${FLAG3}" | base64
   ```

3. **Commit the Changes**:
   ```bash
   git add Makefile
   git commit -m "Inject malicious command into Makefile"
   git push origin main
   ```

4. **Check the Build Logs**: After triggering the pipeline, navigate to your CI/CD tool’s dashboard (e.g., Jenkins) and check the build logs for the Base64 encoded output.

5. **Decode the Flag**:
   Use the following command to decode:
   ```bash
   echo "BASE64_ENCODED_STRING" | base64 --decode
   ```

### Common Troubleshooting Tips
- Ensure proper permissions are set in your repository for committing changes.
- If the pipeline fails, double-check the syntax in your `Makefile`.
- Verify that the pipeline environment is configured to load the necessary secrets.

## Key Takeaways
Today, we’ve explored how attackers can exploit CI/CD pipelines through indirect means, emphasizing the importance of scrutinizing every file that participates in the build process. By understanding the mechanics of Indirect Poisoned Pipeline Execution, we can better safeguard our environments against these stealthy attacks. Remember, vigilance and a thorough review process are key to maintaining secure CI/CD workflows.

## Real-World Applications
In actual production environments, organizations must implement stringent access controls and continuous monitoring of their CI/CD processes. For example, many companies adopt automated security testing tools that scan for vulnerabilities in build configurations, ensuring that no malicious code can be introduced unnoticed. Additionally, educating development teams about these risks and promoting best practices can significantly reduce the likelihood of successful attacks.

---
**Journey Progress:** 79/100 Days Complete 🚀