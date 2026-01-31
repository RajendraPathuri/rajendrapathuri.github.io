---
title: '100 Days of Cloud Security - Day 82: CICD Goat - Insufficient PBAC'
date: '2026-01-31'
author: 'Venkata Pathuri'
excerpt: 'Day 82 of my cloud security journey - CICD Goat - Insufficient PBAC'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 82: CICD Goat - Insufficient PBAC

## Overview
Welcome to Day 82 of our cloud security journey! Today, we dive into the world of Continuous Integration and Continuous Deployment (CI/CD) security, focusing on the challenge of Insufficient Pipeline-Based Access Controls (PBAC). Building on our previous discussions surrounding CI/CD vulnerabilities, we will explore how an inadequately secured Jenkins instance can lead to significant security breaches. The goal is to understand how attackers might exploit these weaknesses and, in turn, learn how to fortify our own pipelines against such threats.

## Learning Objectives
Today’s session aims to empower you with the knowledge to identify and mitigate risks associated with insufficient access controls in CI/CD environments. By the end of this lesson, you will master how to manipulate Jenkins configurations, understand the implications of running code on critical infrastructure, and implement strategies to secure your CI/CD pipelines effectively. You'll also acquire practical skills in modifying Jenkinsfiles and executing commands in a controlled manner.

## Deep Dive
At the heart of Jenkins operation lie two vital components: the Jenkins Controller and the Jenkins Agent. The Controller is responsible for orchestrating the entire CI/CD process, while Agents handle the heavy lifting of tasks like compiling code and running tests. In a typical setup, jobs are designed to run on Agents, keeping the Controller secure. However, when PBAC is insufficient, it can allow jobs to run on the Controller itself, exposing sensitive information.

### The Jenkinsfile: Your Entry Point
The `Jenkinsfile` acts as a blueprint for your CI/CD pipeline. It defines the steps Jenkins should execute and where they should be executed. By default, the agent directive may be set to `any`, enabling the execution of jobs across any available Agent. However, if the configuration permits, you can modify it to specify the built-in Controller, as shown below:

```groovy
pipeline {
    // Target the Controller directly
    agent { label 'built-in' } 
    environment {
        PROJECT = "sanic"
    }
    stages {
        stage ('Exfiltrate_Flag') {
            steps {
                // Read the file located at home directory and base64 encode it 
                // to avoid log formatting issues
                sh """
                    cat ~/flag5.txt
                """
            }
        }
    }
}
```

In this configuration, we are explicitly instructing Jenkins to run the job on the Controller, allowing us to access files and secrets that would otherwise be protected.

### Real-World Example
Consider a scenario where a CI/CD pipeline is used to deploy a critical application. If the Jenkins instance is not properly secured, an attacker with access to the repository can modify the `Jenkinsfile` to execute malicious commands directly on the Controller. This could lead to the exposure of sensitive files such as `~/flag5.txt`, which may contain credentials or other sensitive data.

### Current Best Practices
To safeguard against such vulnerabilities, it is crucial to adopt best practices in your CI/CD configurations:
1. **Set Executors to 0 on Controller**: This ensures that no jobs run directly on the Controller, preventing unauthorized access.
2. **Implement Job Restrictions**: Use plugins that allow you to define which jobs can run on the Controller, minimizing exposure.
3. **Run Jenkins in a Non-Root Context**: Even if a job executes on the Controller, ensure that the Jenkins process runs with limited privileges to reduce the impact of potential exploits.

## Hands-On Practice
To get hands-on experience with these concepts, follow these steps:

1. **Clone the Repository**: Use the command below to clone the relevant repository:
   ```bash
   git clone https://github.com/example/repo.git
   ```

2. **Modify the Jenkinsfile**: Open the `Jenkinsfile` and change the agent directive to `built-in`, as shown previously.

3. **Commit and Push Changes**:
   ```bash
   git add Jenkinsfile
   git commit -m "Modify Jenkinsfile to target Controller"
   git push origin main
   ```

4. **Trigger the Pipeline**: Once your changes are pushed, check the Jenkins dashboard for the build trigger. 

5. **Retrieve the Flag**: After the pipeline runs, navigate to the "Console Output" of the build to view the logs. Look for the output from the command that reads `~/flag5.txt`.

### Troubleshooting Tips
- If your changes do not trigger the pipeline, ensure that the webhook is properly set up in your Git repository.
- Check the Jenkins logs for any errors related to job execution, which may indicate configuration issues.

## Key Takeaways
Today, we explored the critical issue of Insufficient Pipeline-Based Access Controls in Jenkins. We learned how attackers can exploit these vulnerabilities to gain unauthorized access to sensitive information. By understanding the architecture of Jenkins and the significance of the `Jenkinsfile`, we can take proactive measures to secure our CI/CD pipelines against such threats. Remember, the goal is not just to understand how these attacks happen, but also to build robust defenses that safeguard our applications.

## Real-World Applications
In modern software development environments, securing CI/CD pipelines is paramount. Organizations that leverage cloud technologies must ensure their CI/CD tools like Jenkins are configured correctly to prevent unauthorized access. By applying the lessons learned today, you can significantly reduce the risk of data breaches and maintain the integrity of your deployment processes.

---
**Journey Progress:** 82/100 Days Complete 🚀